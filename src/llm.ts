import type { Message } from "./type"

//获取model/api
export async function loadConfig() {
    const config = await Bun.file("opencode.json").json()
    const [providerID, modelID] = config.model.split("/")
    const provider = config.provider[providerID]
    return { baseURL: provider.baseURL, apiKey: provider.apiKey, modelID }
}

//实现发送请求1

type ChatResponse = {
    choices: { message: { content: string } }[]
}

export async function chat(
    messages: Message[],
    config: { baseURL: string; apiKey: string; modelID: string },
): Promise<string> {
    const response = await fetch(`${config.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.modelID,
            messages,
        }),
    })

    if (!response.ok) {
        throw new Error(`API error ${response.status}: ${await response.text()}`)
    }
    const data = (await response.json()) as ChatResponse
    const content = data.choices[0]?.message.content //data.choices[0] 不存在时返回空
    if (content === undefined) {
        throw new Error("API returned no content")
    }
    return content
}

// 流式调 LLM API：逐块返回文本，最后返回完整文本
//回调函数
// onChunk: 调用方传入的"输出函数"，函数体由调用方定义（如打印到屏幕）。
//           本函数只负责"何时调用它"——每收到一段增量文本就调一次。
//           它返回 void，返回值被忽略；实时输出靠它，最终结果靠返回值。
export async function chatStream(
    messages: Message[],
    config: { baseURL: string; apiKey: string; modelID: string },
    onChunk: (text: string) => void,
): Promise<string> {
    const response = await fetch(`${config.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.modelID,
            stream: true, //开启流式
            messages,
        }),
    })

    if (!response.ok){
        const errorText = await response.text()
        throw new Error('API 错误${response.status}: ${errorText}')
    }

    const decoder = new TextDecoder()
    //把所有碎片拼成完整文本
    let fullText = ""
    //行缓冲：跨 chunk 拼半行。SSE 的一行 JSON 可能被网络切成两个 chunk 送达
    let buffer = ""

    for await (const chunk of response.body!){
        //把chunk(Uint8Array 字节) 翻译成 字符串，{stream:true} 续接被切半的 UTF-8 字符
        buffer += decoder.decode(chunk, {stream: true})

        //按 \n 切分；最后一段通常没有 \n（不完整半行），弹回 buffer 等下一个 chunk 续接
        const lines = buffer.split("\n")
        //pop() 取出并删除最后一个元素：半行 → 留；正常结尾的空串 → 丢
        //?? "" 是空值兜底：数组为空时 pop 返回 undefined，保证 buffer 永远是字符串
        buffer = lines.pop() ?? ""

        for (const line of lines){
            //取data：
            if (!line.startsWith("data: ")) continue
            //去除data：
            const data = line.slice(6)
            //跳过 终止标记
            if (data == "[DONE]") continue

            const chunkData = JSON.parse(data)
            const content = chunkData.choices[0]?.delta?.content
            if (content){
                onChunk(content)      // 旁路：把增量喂给调用方的函数（实时显示），返回 void 无所谓
                fullText += content   // 主线：自己累积，循环结束后 return 给调用方（存历史用）
            }
        }
    }

    return fullText

}