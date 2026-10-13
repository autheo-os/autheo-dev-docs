# The Autheo platform map

Autheo is one layered developer platform. The **Autheo L1 blockchain underlies everything**: it holds THEO and settles payments. Above it, the **compute and storage marketplace** sells capacity on the **Layer 0 mesh**, the peer-to-peer compute fabric. **DevHub** deploys apps and agents **to the L0 mesh**, and the **app ecosystem** distributes what developers build. Every section of this documentation belongs to one layer.

![The Autheo stack, top to bottom: app ecosystem (2); DevHub (1) with IDE toolkit, full-stack SDKs, workflow/DAG and agentic OS, deploying to the Layer 0 mesh; the L0 mesh fabrics; the compute/storage marketplace (3); and the Autheo L1 blockchain with testnet and mainnet underneath. THEO runs alongside every layer.](../assets/platform-map.svg)

The red badges are the go-to-market order from the Autheo "go-to-market 1.0" plan: **1** DevHub first, **2** the app ecosystem next, **3** the open compute and storage marketplace third. The full walk through the layers, including what happens to one deployment from `git push` to settlement, is on [The Autheo stack](./stack.md).

## The layers

| Layer | What it is for | Who uses it | Start here |
| --- | --- | --- | --- |
| **2 · App ecosystem** | Publish and distribute apps, packaged services and agents built on DevHub | Publishers and their users | [App ecosystem](./app-ecosystem.md) |
| **1 · DevHub** (Autheo Labs) | The complete IDE toolkit: deploy, full-stack SDKs, workflow/DAG engine, agentic OS; deploys to L0 | App and agent developers | [Build with DevHub](./build.md) |
| **Layer 0 mesh** | The compute, data and network fabric every deployment runs on | Runs underneath DevHub; node operators run it | [Layer 0 mesh](./l0-mesh.md) |
| **3 · Compute / storage marketplace** | Providers sell L0 capacity, buyers attach it to projects; usage is metered | Developers who need capacity; providers | [Compute and storage marketplace](./compute-marketplace.md), [Developer usage](./developer-usage.md) |
| **Autheo L1** (testnet, mainnet) | Token, settlement and durable evidence under everything | Everyone; integrators and validators directly | [L1 testnet and mainnet](./l1-networks.md), [THEO economy](./theo-economy.md) |

## How value moves

1. A developer **builds** in DevHub (box 1) and deploys a project.
2. DevHub **deploys** it to the **Layer 0 mesh**, on platform nodes or on capacity bought in the compute/storage marketplace (box 3).
3. What it consumes is **metered** as developer usage and priced in THEO.
4. Finished work is **published** to the app ecosystem (box 2), where others deploy or use it, which in turn creates more usage.
5. Payments **settle** in THEO on the Autheo L1. Providers and the platform are paid from the same settlement.

## What exists today

Short version, as of **2026-10-12** (details on the [roadmap](./roadmap.md) and [live status](../reference/live-status.md) pages):

- **Live:** dev.autheo.com (DevHub dashboard behind sign-in, public docs and pricing in THEO), the DevHub API host, the Autheo **testnet** EVM RPC (chain 785) and explorer.
- **Built in source, not publicly proven end to end:** the L0 mesh fabrics (iroh QUIC networking, Fluid compute, GuardianDB replication), DevHub workflows, Marketplace placement and allocation boundary, THEO wallet checkout and testnet settlement profile, browser and self-hosted nodes, GPU inference pooling.
- **Planned:** a public app-ecosystem storefront, first-party typed Autheo SDKs, provider payouts at scale, mainnet settlement.

Every page in this documentation labels claims as **live** (probed on a stated date), **source-backed** (code at a pinned commit), or **planned**. When a page and this map disagree, the more specific page wins.

## Choose your path

- **I want to ship an app:** [Build with DevHub](./build.md) → [DevHub overview](../devhub/index.md) → [API and CLI reference](../devhub/api.md).
- **I want to build an agent:** [Agentic OS in DevHub](./build.md#_4-agentic-os) → [AOS stack](../concepts/aos-stack.md) → [Autheo MCP server](../mcp/index.md) → [Identity and agent trust](../concepts/agent-trust.md).
- **I want to sell compute or storage:** [Compute and storage marketplace](./compute-marketplace.md) → [Provider preparation](../guides/provider-design.md).
- **I want to publish to the ecosystem:** [App ecosystem](./app-ecosystem.md) → [Plan an application](../guides/application-lifecycle.md).
- **I integrate with the chain:** [L1 testnet and mainnet](./l1-networks.md) → [Network reference](../reference/networks.md) → [Integration preparation](../guides/integration.md).
- **I want every path side by side:** [Developer journeys](./journeys.md).
