# Developer journeys

Five ways into Autheo, each mapped to the [platform map](./index.md). Each step says what is **live**, **source-backed** or **planned** so you know where the path currently ends.

## 1. App developer: build → run → pay

| Step | Do | Status |
| --- | --- | --- |
| Sign up | Create an account at [dev.autheo.com](https://dev.autheo.com/sign-up) | Live |
| Deploy | Import a Git repo; get a preview URL per push; promote to production | Live dashboard ([DevHub](../devhub/index.md)) |
| Automate | Use the [REST API](../devhub/api.md), CLI or the Vercel-compatible SDK | API live; CLI/SDK source-backed |
| Add workflows | Define durable workflows; watch runs at `/workflows` | Source-backed ([Workflow/DAG](./build.md#_3-workflow-dag-tool)) |
| Pay | Pick a plan in THEO; pay from your wallet | Pricing live; checkout source-backed ([usage](./developer-usage.md)) |

## 2. Agent builder: agentic OS

| Step | Do | Status |
| --- | --- | --- |
| Connect tools | Install the [Autheo MCP server](../mcp/index.md) in your MCP client | Source-backed |
| Give the agent an identity | Create a did:key identity and a scoped mandate ([agent trust](../concepts/agent-trust.md)) | Source-backed |
| Run models | Serve a model from DevHub's GPU inference pool | Source-backed |
| Act with receipts | Policy check → tool call → signed receipt | Planned as one path ([AOS](../concepts/aos-stack.md)) |

## 3. Compute or storage provider

| Step | Do | Status |
| --- | --- | --- |
| Prepare | Read [provider preparation](../guides/provider-design.md) | Guide |
| Join the mesh | Run a self-hosted node, or donate a browser node at `/run-node` | Source-backed; `/run-node` behind sign-in |
| List capacity | Publish a compute or storage listing in the Marketplace | Gated; public Marketplace host not reachable 2026-10-12 |
| Get paid | THEO settlement via the fee-split contract on testnet | Source-backed ([THEO economy](./theo-economy.md)) |

## 4. App publisher

| Step | Do | Status |
| --- | --- | --- |
| Cut a release | Create an immutable Marketplace release of a project | Source-backed ([app ecosystem](./app-ecosystem.md)) |
| Package it | Start from a template or game preset | Source-backed |
| Publish and earn | List in the app ecosystem | Planned |

## 5. Chain integrator or validator

| Step | Do | Status |
| --- | --- | --- |
| Connect to testnet | Chain 785 at `testnet-rpc1.autheo.com` | Live ([L1 networks](./l1-networks.md)) |
| Use chain APIs | Cosmos and EVM API families | Source-backed ([API reference](../reference/api.md)) |
| Run a node | Follow [node preparation](../guides/node-operator.md) with an approved release | Guide |
