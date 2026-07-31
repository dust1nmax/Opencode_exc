# Opencode_exc

复现学习 opencode 源码的练习项目。

## 项目背景

通过研究 [opencode](https://github.com/anomalyco/opencode)（开源 AI Coding Agent）的源码，从零掌握 AI Agent 的内部原理与工程实现。

## 技术栈

| 技术 | 用途 |
|------|------|
| Bun | JS 运行时 + 包管理器 |
| TypeScript | 带静态类型的 JS |
| Effect-TS | 函数式框架（DI + 错误处理 + 流式） |
| Drizzle ORM | SQLite 数据库操作 |
| opentui + SolidJS | 终端 UI 界面 |

## 核心概念

Agent 本质是一个循环：

```
用户输入 → 组装系统提示词 → 调 LLM → LLM 返回工具调用 → 执行工具 → 结果喂回 LLM → 继续循环
```

关键模块：
- **Session** - 对话生命周期管理
- **Tool** - 工具扩展（读写文件、执行命令等）
- **Provider** - LLM 厂商抽象
- **Agent** - Agent 人格配置
- **Permission** - 权限控制

## 相关项目

- [opencode](https://github.com/anomalyco/opencode) - 官方源码（只读参考）
- [OpenCodeFromScratch](https://github.com/dust1nmax/OpenCodeFromScratch) - 从零复刻的教学项目

## 学习路线

1. **阶段 0-9**：用最少抽象把 agent loop 跑通
2. **阶段 10+**：逐模块深入阅读 opencode 源码

## License

MIT