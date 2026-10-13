# The Autheo agent operating stack (AOS)

The **agent operating stack** is the set of pieces an AI agent needs to do real work on Autheo: an interface, a kernel that schedules and routes work, agent runtimes, governance and trust, tools reached through MCP, models, and infrastructure. [JARVIS](https://github.com/SolutionsAsService/JARVIS) is the hub where these pieces are collected, tested and wired together.

Source: JARVIS `src/aos-stack.js` (the single catalog the JARVIS landing page renders) at commit `a7edfd2` (2026-10-12), and the architecture narrative [autheo-os/autheo-stack](https://github.com/autheo-os/autheo-stack).

## Status words

Every component carries exactly one status, and JARVIS tests enforce the honesty rules:

- **integrated**: code inside JARVIS that tests exercise.
- **adapter**: JARVIS code that talks to a separately running system; **off by default**.
- **planned**: not connected yet.

At this commit: 14 integrated, 5 adapters, 20 planned.

## The seven layers

| Layer | Purpose | Integrated | Adapter (off by default) | Planned |
| --- | --- | --- | --- | --- |
| Interface | Where people and systems reach JARVIS | JARVIS web workspace, kernel HTTP API | | OpenClaw channels and Control UI |
| Kernel & routing | One scheduler, one execution owner, skill/model routing, context | Kernel scheduler + supervisor, skill router, baseline model router, JCP context manifests | | OpenClaw memory, Mem0, Letta |
| Agents & runtimes | Agent loops, workflow policy, agent-company runtimes | JARVIS bounded-work policy | Paperclip, DADA design skill, last30days research skill | OpenClaw agent runtime, Freddie, gm, agentplug |
| Governance & trust | Who may do what, under which budget, with which receipt | JARVIS governance, extracted OpenClaw policy matcher | [Autheo Agent Environment](./agent-trust.md) | |
| Tools & MCP | Capabilities reached through MCP | MCP TypeScript SDK client, owned fixture MCP server | gm-mcp | [Autheo MCP](../mcp/index.md), Unified CAD MCP, MCP filesystem, GitHub MCP |
| Models | Inference | | | agentic-router, LiteLLM, hosted model APIs, Ollama |
| Infrastructure & deploy | Ledger, CI, containers, hosting | Task event ledger, GitHub Actions CI, static container | | OpenTelemetry, Langfuse, [Autheo DevHub](../devhub/index.md) (listed in the JARVIS catalog under both its earlier name Shadw and Autheo DevHub) |

## How the Autheo pieces fit

The autheo-stack narrative describes the platform side:

- **Layer 0 / DevHub** hosts workloads ([DevHub](../devhub/index.md)).
- **Marketplace** provider orchestration supplies DevHub hosting capacity priced in THEO.
- A distinct, **proposed Layer 1** handles verification and settlement on the Autheo chain (Cosmos SDK / CometBFT with EVM).
- **Autheo MCP** gives agents read-only, agent-facing tools over DevHub, Marketplace and the chain.
- The **Autheo Agent Environment** gives agents identities, delegated authority and signed receipts ([Identity and agent trust](./agent-trust.md)).

An agent task in this model flows: request → JARVIS kernel → policy check (Autheo Agent Environment, signed receipt) → tool call (MCP) → DevHub or Marketplace → result with receipt.

::: warning What actually runs today
In JARVIS today the tested paths are the live digest task and an owned MCP tool call. The full LLM-driven task path, Autheo MCP inside JARVIS, and DevHub as a JARVIS deploy target are **planned**. The Autheo Agent Environment adapter signs receipts locally, but the kernel does not yet call it before acting.
:::

## Add a component

JARVIS pins external components by exact commit in `upstreams/lock.json`, checks a structural contract snapshot, and keeps adapters off by default behind an environment flag. `npm run upstream:check` reports when an upstream moved; `npm run upstream -- update <id>` re-pins after the contract diff passes. See JARVIS `docs/UPSTREAMS.md`.
