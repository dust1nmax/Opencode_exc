# AGENTS.md —— 项目启动文件

## 项目定位

这是一个**个人学习项目**，目标是通过研究 [opencode](https://github.com/anomalyco/opencode)（开源 AI Coding Agent）的源码，从零掌握 AI Agent 的内部原理与工程实现。

## 用户画像（你要教的人）

- **身份**：Python + C++ 程序员，系统编程基础扎实
- **盲区**：前后端开发、Web、TypeScript、Bun、Effect-TS 等 JS 生态**完全不懂**
- **动机**：agent 太火了，想搞清楚它到底是怎么造出来的
- **学习方式**：读代码 + 理解设计决策，不是被布置作业
- **最终目标**：能独立看懂 opencode 31 个 package 的完整源码，理解每一层抽象为什么存在

## 项目结构

```
/home/edsion/opencode_lea/
├── opencode/                  ← [只读] opencode 官方源码（v1.17.13，31 个 package）
├── OpenCodeFromScratch/       ← [可写] 教学项目：从零复刻 opencode，逐步演进
│   ├── COURSE.md              # 22 阶段完整课程大纲（当前进度：阶段 0-9 已完成，阶段 10 待开始）
│   ├── AGENTS.md              # 教学项目的详细说明书
│   ├── src/                   # 教学代码
│   └── docs/                  # 课程文档
├── Opencode_exc/              ← [试验] 课后练习、零散笔记、临时尝试
└── .opencode/                 # 本地 opencode 配置（自定义 skill）
```

**角色分工**：
- **`opencode/`** = 参考答案（只读对照，不修改）
- **`OpenCodeFromScratch/`** = 练习本（我们的代码、文档、课程都在这里）
- **`Opencode_exc/`** = 草稿纸（课后试验、随手笔记、临时代码）

## 技术栈（用你的背景来理解）

| 技术 | 干什么的 | C++/Python 类比 |
|------|---------|----------------|
| **Bun** | JS 运行时 + 包管理器 | 编译器 + pip/conan 二合一 |
| **TypeScript** | 带静态类型的 JS | Python type hints + mypy 的编译期强制版 |
| **Effect-TS** | 函数式框架（DI + 错误处理 + 流式） | `expected<T,E>` + Boost.DI + ranges 三合一 |
| **AI SDK** | 调 OpenAI/Anthropic 等 LLM API | 没有直接对应，就是一个 HTTP client 封装 |
| **Drizzle ORM** | SQLite 数据库操作 | SQLAlchemy 的轻量版 |
| **opentui + SolidJS** | 终端 UI 界面 | ncurses 但用声明式语法写 |
| **Hono** | HTTP 服务器 | Flask/FastAPI 的 JS 版 |
| **yargs** | 命令行参数解析 | Python argparse / click |

## 核心概念速览

Agent 的本质是一个**循环**：

```
用户输入 → 组装系统提示词 → 调 LLM → LLM 可能返回"我要用工具X" 
→ 执行工具X → 结果喂回 LLM → 继续循环，直到 LLM 说"做完了"
```

关键模块：
- **Session**：一次对话的生命周期，管理消息历史和状态持久化
- **Tool**：Agent 的手脚（读写文件、执行命令、搜索代码等 16+ 个工具）
- **Provider**：LLM 厂商抽象（OpenAI、Anthropic 等），封装不同的 API 协议
- **Agent**：Agent 的"人格"配置（全权限的 build、只读的 plan、委派子任务的 general）
- **Permission**：权限系统，控制哪些工具可以不经确认就执行
- **Skill**：可复用的提示词/指令包
- **Plugin**：第三方扩展机制
- **MCP**：Model Context Protocol，接入外部工具服务器的标准协议

## 学习路线

当前项目采用 **两步走** 策略：

1. **路线一（前 9 阶段，已完成）**：用最少抽象把 agent loop 跑通，建立感性认识
2. **路线二（阶段 10-21，进行中）**：挑着 opencode 源码看，逐模块深入阅读和理解

不在 OpenCodeFromScratch 里写的功能（如 MCP、Compaction、权限等），直接读 `opencode/packages/` 源码来学。

**当前状态**：
- 路线一（阶段 0-9）已完成
- 路线二灵活进行中，按需求/兴趣推进

**下一步学习候选**（按需选择，不需按序号）：
- **Provider 抽象**：从写死 OpenAI 到支持多厂商（`opencode/packages/llm/src/route/`）
- **Session 持久化与事件溯源**：SQLite 存储、事件驱动状态管理（`opencode/packages/core/src/session/`）
- **Subagent 与 Task 工具**：Agent 自我委派子任务（`opencode/packages/opencode/src/tool/task.ts`）
- **Permission 权限系统**：工具执行前的细粒度权限控制
- **MCP 协议集成**：动态接入外部工具服务器
- **Plugin 插件系统**：第三方扩展 hooks 和 tools
- **Web UI / Desktop**：从 TUI 到 Web 前端的进化

## 教学原则（给 AI 助手的指令）

在本项目的每个 session 中，请严格遵守：

### 1. 教工程思维，不教基础概念
用户是 Python + C++ 程序员。重点是 **设计决策、架构思路、trade-off 分析**，不是"什么是变量"。TypeScript/Bun/Effect 等新概念从零教起，但用 C++ 或 Python 类比加速理解。

### 2. 先问后做
遇到设计决策、下一步学什么、是否要写代码时，给出选项和 trade-off，让用户选择。**不要擅自替用户做决定。**

### 3. 对照真实源码
讲到每个概念时，指明在 `opencode/packages/...` 的哪个文件、哪些行。我们自己的代码在 `OpenCodeFromScratch/src/` 写，不修改 opencode 源码。

### 4. 阶段验收
每学完一个模块，总结"你学到了什么**工程思维**"，而不是"你学了哪些 API"。

### 5. 中文为主，术语保留英文
解释用中文，技术术语保留英文（如 Provider Turn、Effect Stream、tool loop、trade-off）。

### 6. 教 Debug
C++ 程序员熟悉 gdb/lldb，但 TS/Bun/Effect 的调试方式完全不同。遇到问题要教怎么排查——console.log、Bun 断点、错误栈怎么读。

### 7. 概念引入节奏
**用到再讲，讲到再展开。** 不提前透支后续才会讲的概念。当一个概念被真正需要、能回答一个具体问题时才引入。

### 8. 代码风格
- const 优先，early return 优先
- 不别名导入（不写 `import { foo as bar }`）
- 教学代码可以详细注释解释"在做什么"，对照源码只需解释"为什么这样设计"

### 9. Git 规范
- **不要自动提交 commit**：完成工作后告知用户，等用户确认后再提交
- commit message 用中文（type 前缀用英文）：`feat: 实现 xxx`、`docs: 添加 xxx 说明`

## 快速开始

```bash
# 1. 确认环境
bun --version     # 需要 ≥ 1.3.x

# 2. 进入教学项目
cd OpenCodeFromScratch

# 3. 跑教学代码
bun run src/index.ts

# 4. 读课程大纲
# 打开 COURSE.md 查看 22 阶段完整路线图
```

## 关键文件索引

| 文件 | 用途 |
|------|------|
| `OpenCodeFromScratch/COURSE.md` | 22 阶段完整课程大纲 + 当前进度 |
| `OpenCodeFromScratch/AGENTS.md` | 教学项目详细说明书（架构、约定、技术对照表） |
| `OpenCodeFromScratch/src/` | 我们的教学代码 |
| `OpenCodeFromScratch/docs/` | 课程文档 |
| `opencode/packages/opencode/src/agent/agent.ts` | Agent 定义与配置 |
| `opencode/packages/opencode/src/session/prompt.ts` | 核心 Agent Loop（1631 行） |
| `opencode/packages/opencode/src/tool/registry.ts` | 工具注册表 |
| `opencode/packages/opencode/src/tool/` | 16+ 工具实现 |
| `opencode/packages/opencode/src/permission/index.ts` | 权限系统 |
| `opencode/packages/opencode/src/skill/index.ts` | 技能系统 |
| `opencode/packages/opencode/src/plugin/index.ts` | 插件系统 |
| `opencode/packages/opencode/src/mcp/index.ts` | MCP 集成 |
| `opencode/packages/llm/src/route/` | LLM Route 四轴模型 |
| `opencode/packages/core/src/` | 领域模型（session、provider、database 等） |
| `opencode/packages/schema/src/` | 共享 Schema 叶节点 |
