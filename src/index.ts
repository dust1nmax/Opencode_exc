import type { Message } from "./type";
import { loadConfig, chat } from "./llm";
import { constants } from "bun:sqlite";

const config = await loadConfig()

const messages: Message[] = [
    { role: "system", content: "你是一个简洁的编程助手，用中文回答"},
    { role: "user", content: "什么是async"},
]

const reply = await chat(messages, config)
console.log(reply)