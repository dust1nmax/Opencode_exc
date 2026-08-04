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
    const content = data.choices[0]?.message.content
    if (content === undefined) {
        throw new Error("API returned no content")
    }
    return content
}
