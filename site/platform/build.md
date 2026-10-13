# Build with DevHub (surface 1)

**DevHub** is Autheo Labs' complete developer toolkit and the first go-to-market surface. It is live at [dev.autheo.com](https://dev.autheo.com) and its source is [autheo-os/L0_devhub_deploy](https://github.com/autheo-os/L0_devhub_deploy) (reviewed at commit `29abc9f`). DevHub is the developer surface: it builds your code and **deploys it to the [Layer 0 mesh](./l0-mesh.md)**, which runs on capacity settled in THEO on the [Autheo L1](./l1-networks.md) (see [The Autheo stack](./stack.md)). The vision groups DevHub into four parts; this page documents each one with its real status.

| Layer | What you get | Status (2026-10-12) |
| --- | --- | --- |
| [1. IDE toolkit](#_1-ide-toolkit) | Dashboard, Git deploys, previews, rollback, domains, secrets, logs, CLI, local node | **Live** dashboard behind sign-in; CLI and local node **source-backed** |
| [2. Full-stack SDKs](#_2-full-stack-sdks) | REST API, SDK-compatible client, agent-trust SDKs, MCP | REST API **live**; SDKs **source-backed**; first-party typed Autheo SDKs **planned** |
| [3. Workflow / DAG tool](#_3-workflow-dag-tool) | Durable multi-step workflows with a run graph, cron, queues | **Source-backed**; console at `/workflows` behind sign-in |
| [4. Agentic OS](#_4-agentic-os) | Agent runtime stack, MCP tools, identities, delegated authority, receipts | Pieces **source-backed**; end-to-end agent path **planned** |

## 1. IDE toolkit

The DevHub dashboard is the developer's home. Public pages describe it; the dashboard itself redirects to sign-in (probed 2026-10-12).

**What it covers** (from the dashboard route tree under [`ui/app/`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/app) and the public [features page](https://dev.autheo.com/features)):

- **Projects and deployments:** import a Git repo, a container image or an upload; every push builds an immutable deployment with its own URL; production is an alias, so promotion and rollback are alias moves.
- **Compute types:** serverless functions ("fluid compute", scale to zero), containers from a Dockerfile, edge functions, sandboxes, cron jobs and queues.
- **Data:** GuardianDB replicated storage, serverless Postgres and Redis, a project drive with WebDAV, and storage snapshots.
- **Networking:** custom domains and DNS with automatic TLS, regions, firewall, raw ports for game servers.
- **Operations:** live logs, monitoring, observability (service graph, Core Web Vitals), activity and audit, usage and billing.
- **GitOps:** platform configuration mirrored to the repository as `openedge.yaml`; a push rebuilds and redeploys. GitHub access goes through a GitHub App or Composio's v3 API ([`ui/lib/composio.ts`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/lib/composio.ts)).

**Command line and local development** (source-backed, see [DevHub API and CLI reference](../devhub/api.md)):

- `@shadw/cli` is the npm wrapper for the `shadw` CLI (deploy, projects, domains, databases, workflows, observability). The package and binary still use the platform's earlier working name.
- `@shadw/node` boots a real single `hive-cloud` node locally with `npx`, the same server binary fleet nodes run, in mock mode for development.
- Operator CLIs `hivectl` and `fluidctl` exist in the same repository.

::: warning Naming
DevHub was developed under the working names *shadw* and *OpenEdge*. Package names, the CLI binary, `llms.txt` and the API host `api.shadw.cloud` still use them. They are the same product as Autheo DevHub. The live getting-started page names `api.autheo.dev`, which did not resolve on 2026-10-12; use the host shown in your dashboard's API reference.
:::

## 2. Full-stack SDKs

"Full-stack SDKs" means a developer can drive every layer (deploy, data, workflows, marketplace, chain, agents) from code. Today that is assembled from several pieces:

| Piece | Language | What it does | Status |
| --- | --- | --- | --- |
| DevHub REST API | HTTP | 34 documented endpoints for deploys, projects, env, domains, nodes and more | **Live** host; [generated reference](../devhub/api.md) |
| `@openedge/vercel-sdk` | TypeScript | A fork of `@vercel/sdk` pointed at the DevHub API with a `hive_…` platform key; existing `@vercel/sdk` code repoints with one import change ([`packages/vercel-sdk`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/packages/vercel-sdk/README.md)) | **Source-backed** |
| Starter projects | Bun, Node, Next.js, Hono, Express | Deployable examples in [`examples/`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/examples) | **Source-backed** |
| Autheo Agent Environment | Python, plus a JavaScript verifier | Agent identities (did:key), scoped mandates, signed receipts ([details](../concepts/agent-trust.md)) | **Source-backed** |
| Autheo MCP server | Python (MCP) | Agent-facing tools over DevHub, Marketplace and the chain ([reference](../mcp/tools.md)) | **Source-backed**, verified against fixtures |
| Chain access | Any EVM or Cosmos client | Standard JSON-RPC (testnet chain 785) and Cosmos SDK APIs ([L1 networks](./l1-networks.md)) | Testnet RPC **live** |

**Planned:** first-party, typed Autheo SDKs (TypeScript, Python, Rust) that wrap DevHub, Marketplace, THEO payments and agent trust under one client and one auth model. Until they ship, use the REST API or the Vercel-compatible client for DevHub, and standard EVM tooling for the chain.

## 3. Workflow / DAG tool

DevHub ships a durable workflow engine: multi-step jobs that persist each step, survive restarts and can be resumed, replayed or cancelled. Each workflow publishes a **graph**, so the console can draw it as a DAG.

**Source evidence:** the admin API in [`crates/hive-cloud/src/admin.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/admin.rs) and the console bridge [`ui/lib/wf-console/hive-world.mjs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/lib/wf-console/hive-world.mjs).

| Operation | Endpoint (admin API) |
| --- | --- |
| List or define workflows (with graph manifest) | `GET` / `POST /v1/workflows` |
| Start a run | `POST /v1/workflows/:id/run` |
| List runs, read one run | `GET /v1/workflows/runs`, `GET /v1/workflows/runs/:id` |
| Cancel, replay, re-enqueue, wake up | `POST /v1/workflows/runs/:id/{cancel,replay,reenqueue,wakeup}` |
| Append an event to a run | `POST /v1/workflows/runs/:id/events` |
| Hooks and summary | `GET /v1/workflows/hooks`, `GET /v1/workflows/summary` |

The dashboard at `/workflows` embeds the upstream `@workflow/web` console, backed by DevHub's real run data through a `@workflow/world` adapter: runs, steps, events, hooks and the per-workflow graph. Requests carry the team and a bearer token. Cron schedules and queues are separate DevHub primitives that can start workflows.

**Not yet:** a visual drag-and-drop DAG *editor*. Workflows are defined in code and visualised, not drawn. Agent-driven workflow authoring is part of the [agentic OS](#_4-agentic-os) plan.

## 4. Agentic OS

The agentic OS is the layer that lets AI agents build, deploy and operate on Autheo safely. It is documented in depth in [The agent operating stack (AOS)](../concepts/aos-stack.md); here is how it plugs into DevHub:

- **Kernel and interface:** [JARVIS](https://github.com/SolutionsAsService/JARVIS) collects the stack (scheduler, skill and model routing, governance) and labels every component integrated, adapter or planned.
- **Tools:** the [Autheo MCP server](../mcp/index.md) exposes DevHub, Marketplace and chain reads to any MCP client (Claude, OpenClaw and others). Write and transaction tools stay gated.
- **Trust:** the [Autheo Agent Environment](../concepts/agent-trust.md) gives each agent an identity, a scoped mandate with budget, and a signed receipt for every action.
- **Delegated operations:** [Freddie](../components/freddie.md) is the design for persistent, delegated operational agents.
- **Compute for agents:** DevHub's GPU pool and managed llama.cpp inference ([`inference.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/inference.rs)) let a project serve an OpenAI-compatible model endpoint inside the fleet.

::: warning What runs end to end
An agent that plans, calls Autheo MCP, gets a policy decision and receipt, then deploys through DevHub, is **planned**. Each piece exists separately; the joined path has not been demonstrated.
:::

## Next

[Compute and storage marketplace](./compute-marketplace.md) · [DevHub overview](../devhub/index.md) · [Developer journeys](./journeys.md)
