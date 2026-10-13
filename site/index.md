# AUTHEO documentation

AUTHEO brings together a settlement chain and a design for peer connectivity, distributed compute, a capacity marketplace, developer workflows and agent-assisted operations. This documentation explains each component, how they exchange intent and evidence, and which claims have implementation support.

::: warning Publication candidate
This documentation was reviewed on **9 October 2026**. Source-backed does not mean deployment-tested. This site does not certify network availability, platform launch status, security guarantees, or regulatory approval.
:::

## Start with the platform map

Autheo is one platform with three surfaces priced and settled in THEO on the Autheo L1: **(1) DevHub**, the Autheo Labs IDE toolkit with full-stack SDKs, a workflow/DAG engine and the agentic OS; **(2) the Autheo app ecosystem**; and **(3) the compute and storage marketplace**. The [platform map](./platform/index.md) explains how they connect, the [developer journeys](./platform/journeys.md) give a path per role, and the [roadmap](./platform/roadmap.md) records what is live, source-backed or planned as of 12 October 2026.

| Surface | Read |
| --- | --- |
| 1 · Build | [Build with DevHub](./platform/build.md), [DevHub overview](./devhub/index.md), [API and CLI](./devhub/api.md), [MCP server](./mcp/index.md) |
| 2 · Ship | [App ecosystem](./platform/app-ecosystem.md) |
| 3 · Run | [Compute and storage marketplace](./platform/compute-marketplace.md), [Developer usage](./platform/developer-usage.md) |
| Settle | [THEO economy](./platform/theo-economy.md), [L1 testnet and mainnet](./platform/l1-networks.md) |

## Choose your path

- **New to AUTHEO?** Start with [the orientation](./getting-started/index.md) and [architecture](./concepts/architecture.md).
- **Application developer?** Read [integration preparation](./guides/integration.md), then the [source-backed API reference](./reference/api.md).
- **Node operator?** Follow [node preparation](./guides/node-operator.md) and [network reference](./reference/networks.md).
- **Looking for mesh, DevHub, or marketplace instructions?** Read the [ecosystem map](./concepts/ecosystem.md), then [Mesh](./components/mesh.md), [DevHub](./components/devhub.md), [Marketplace](./components/marketplace.md) or [Freddie](./components/freddie.md). These design guides are not interchangeable with the implemented chain.
- **Maintaining these docs?** Use [contribution rules](./contributing/index.md) and [standalone deployment](./deployment/index.md).

## Understand the whole workflow

Start with [who does what](./concepts/ecosystem.md), follow [control, data and accounting flows](./concepts/data-flows.md), then prepare an [application brief](./guides/application-lifecycle.md) or [provider review](./guides/provider-design.md). Intended capabilities are explained without presenting planning examples as shipped commands.

## What is verified here?

The public chain repository contains Cosmos SDK, CometBFT, and Ethermint/EVM application code. The official network repository publishes a mainnet configuration. [Evidence and limits](./reference/sources.md) identify exact revisions. No live transaction, validator operation, or RPC availability test was performed for this documentation update.

Use the [status matrix](./reference/status.md) whenever a capability claim affects your implementation.
