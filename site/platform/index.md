# The Autheo platform map

Autheo is one developer platform with three surfaces, all priced and settled in **THEO** on the **Autheo L1 blockchain**. This page is the map for the rest of the documentation: every section below belongs to one box in the diagram.

![Autheo platform map: DevHub (1) feeds the compute and storage marketplace (3) and the Autheo app ecosystem (2); developer usage connects them; everything sits inside the THEO economy on the Autheo L1 (testnet and mainnet).](../assets/platform-map.svg)

The numbers are the go-to-market order from the Autheo "go-to-market 1.0" plan: **1** DevHub first, **2** the app ecosystem next, **3** the open compute and storage marketplace third. They are not a ranking of importance.

## The five boxes

| # | Surface | What it is for | Who uses it | Start here |
| --- | --- | --- | --- | --- |
| 1 | **DevHub** (Autheo Labs) | The complete IDE toolkit: deploy, full-stack SDKs, a workflow/DAG engine and the agentic OS | Application and agent developers | [Build with DevHub](./build.md) |
| 3 | **Compute / storage marketplace** | Buy compute and storage capacity from providers, or sell yours | Developers who need capacity; node operators who supply it | [Compute and storage marketplace](./compute-marketplace.md) |
| — | **Developer usage** | Metering what projects consume and charging for it | Every paying developer | [Developer usage and billing](./developer-usage.md) |
| 2 | **Autheo app ecosystem** | Publish and distribute apps, packaged services and agents built on DevHub | App publishers and their users | [App ecosystem](./app-ecosystem.md) |
| — | **THEO + L1** | The token that prices everything and the chain that settles it (testnet, mainnet) | Everyone; integrators and validators directly | [THEO economy](./theo-economy.md), [L1 testnet and mainnet](./l1-networks.md) |

## How value moves

1. A developer **builds** in DevHub (box 1) and deploys a project.
2. The project **runs** on platform capacity or on capacity bought in the compute/storage marketplace (box 3).
3. What it consumes is **metered** as developer usage and priced in THEO.
4. Finished work is **published** to the app ecosystem (box 2), where others deploy or use it, which in turn creates more usage.
5. Payments **settle** in THEO on the Autheo L1. Providers and the platform are paid from the same settlement.

## What exists today

Short version, as of **2026-10-12** (details on the [roadmap](./roadmap.md) and [live status](../reference/live-status.md) pages):

- **Live:** dev.autheo.com (DevHub dashboard behind sign-in, public docs and pricing in THEO), the DevHub API host, the Autheo **testnet** EVM RPC (chain 785) and explorer.
- **Built in source, not publicly proven end to end:** DevHub workflows, Marketplace placement and allocation boundary, THEO wallet checkout and testnet settlement profile, browser and self-hosted nodes, GPU inference pooling.
- **Planned:** a public app-ecosystem storefront, first-party typed Autheo SDKs, provider payouts at scale, mainnet settlement.

Every page in this documentation labels claims as **live** (probed on a stated date), **source-backed** (code at a pinned commit), or **planned**. When a page and this map disagree, the more specific page wins.

## Choose your path

- **I want to ship an app:** [Build with DevHub](./build.md) → [DevHub overview](../devhub/index.md) → [API and CLI reference](../devhub/api.md).
- **I want to build an agent:** [Agentic OS in DevHub](./build.md#_4-agentic-os) → [AOS stack](../concepts/aos-stack.md) → [Autheo MCP server](../mcp/index.md) → [Identity and agent trust](../concepts/agent-trust.md).
- **I want to sell compute or storage:** [Compute and storage marketplace](./compute-marketplace.md) → [Provider preparation](../guides/provider-design.md).
- **I want to publish to the ecosystem:** [App ecosystem](./app-ecosystem.md) → [Plan an application](../guides/application-lifecycle.md).
- **I integrate with the chain:** [L1 testnet and mainnet](./l1-networks.md) → [Network reference](../reference/networks.md) → [Integration preparation](../guides/integration.md).
- **I want every path side by side:** [Developer journeys](./journeys.md).
