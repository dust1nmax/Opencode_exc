// src/stream-demo.ts
import { loadConfig } from "./llm"

const config = await loadConfig()

// 发流式请求（多了 stream: true）
const response = await fetch(`${config.baseURL}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
  },
  body: JSON.stringify({
    model: config.modelID,
    stream: true,  // ← 关键：开启流式
    messages: [
      { role: "system", content: "你是一个简洁的助手，用中文回答" },
      { role: "user", content: "什么是闭包？一句话解释" },
    ],
  }),
})

// 逐块读取流式响应
const decoder = new TextDecoder()
for await (const chunk of response.body!) {
  const text = decoder.decode(chunk)

  // 按 SSE 格式解析
  for (const line of text.split("\n")) {
    //SSE文本：
    //data: {"choices":[{"delta":{"content":"闭"},"finish_reason":null}]}
    //data: {"choices":[{"delta":{"content":"包"},"finish_reason":null}]}
    //data: [DONE]
    //取SSE原始文本里的 data：开头的文本
    if (!line.startsWith("data: ")) continue 
    const data = line.slice(6)  //去除 data：
    if (data === "[DONE]") break

    const json = JSON.parse(data)
    const content = json.choices[0]?.delta?.content
    if (content) {
      process.stdout.write(content)  // 逐字打印，不换行
    }
  }
}

console.log()  // 最后补一个换行
