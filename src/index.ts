import type { Message } from "./type";
import { loadConfig, chat, chatStream } from "./llm";
import { test } from "bun:test";

const config = await loadConfig()

//只能问一个问题
// const messages: Message[] = [
//     { role: "system", content: "你是一个简洁的编程助手，用中文回答"},
//     { role: "user", content: "什么是async"},
// ]

//通过push入message 实现对话
const messages: Message[] = [
    { role: "system", content: "你是一个简洁的助手，用中文回答" }
]

console.log("AI 助手已启动，输入问题开始对话(Ctrl+C 退出）")

while (true) {
    const input = prompt("user: ")
    if (!input) break

    messages.push({ role: "user", content: input })
    //const reply = await chat(messages, config)
    process.stdout.write("AI: ")
    const reply = await chatStream(messages, config, (text) => {
        process.stdout.write(text)
    })
    console.log() //回复结束 换行
    
    messages.push({ role: "assistant", content: reply })

    //console.log("AI:", reply)
}
