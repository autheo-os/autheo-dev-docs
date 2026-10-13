# The Autheo stack: from L1 to apps

Autheo is a **layered** platform. The **Autheo L1 blockchain underlies everything**. On top of it, providers sell capacity through the **compute and storage marketplace**. That capacity forms the **Layer 0 (L0) mesh**, the peer-to-peer compute fabric. **DevHub** deploys applications and agents **to the L0 mesh**, and the **app ecosystem** distributes what developers build. **THEO** prices and settles every layer.

![The Autheo stack, top to bottom: app ecosystem (2); DevHub (1) with IDE toolkit, full-stack SDKs, workflow/DAG and agentic OS, deploying to the Layer 0 mesh; the L0 mesh with distributed compute, compute, data and network fabrics and identity and trust; the compute/storage marketplace (3); and the Autheo L1 blockchain with testnet and mainnet underneath. THEO runs alongside every layer.](../assets/platform-map.svg)

This layering is the one DevHub's own README uses ("The Autheo Developer Cloud": developer experience → application runtime → distributed compute → compute fabric → data fabric → network fabric → identity and trust → resource marketplace → Autheo Network), source [`README.md`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/README.md). The red badges are the go-to-market order.

## The layers, bottom up

| Layer | Job | Built from | Status (2026-10-12) | Read |
| --- | --- | --- | --- | --- |
| **Autheo L1** | Ordered state, THEO, settlement, durable evidence | Cosmos SDK, CometBFT, Ethermint EVM, IBC | Testnet RPC **live** (chain 785); mainnet config published | [L1 testnet and mainnet](./l1-networks.md) |
| **Marketplace** (3) | Sell and buy L0 capacity; pin placement; settle in THEO | DevHub marketplace boundary + Marketplace service | **Source-backed**; public host not reachable | [Compute and storage marketplace](./compute-marketplace.md) |
| **Layer 0 mesh** | Run workloads on many independent nodes | iroh QUIC, Fluid compute, microVM cells, GuardianDB | **Source-backed**; serves dev.autheo.com deployments | [Layer 0 mesh](./l0-mesh.md) |
| **DevHub** (1) | Turn code into running deployments on L0 | Dashboard, API, CLI, SDKs, workflows, agentic OS | **Live** dashboard (sign-in) | [Build with DevHub](./build.md) |
| **App ecosystem** (2) | Distribute apps, services and agents | Immutable releases, presets, templates | Releases **source-backed**; storefront **planned** | [App ecosystem](./app-ecosystem.md) |

## What each layer gives the one above

- **L1 → marketplace:** a token (THEO) and a settlement contract whose `Settlement` events DevHub verifies, so a provider is paid and the platform fee is taken in one on-chain transaction. ([THEO economy](./theo-economy.md))
- **Marketplace → L0:** a placement policy per order: which approved nodes may run a buyer's workload. L0 never falls back to unapproved nodes.
- **L0 → DevHub:** compute (functions, containers, sandboxes, GPU), replicated data, routing and TLS across the mesh, with no single cloud region.
- **DevHub → app ecosystem:** immutable, capability-declared releases that others can deploy and pay for.

## One deployment, end to end

What happens when you push code. Each step names the source that implements it.

1. **Push.** A Git push (GitHub App or Composio) or an upload reaches DevHub's API. ([DevHub API](../devhub/api.md))
2. **Build.** DevHub builds in a fail-closed sandbox: Podman with gVisor (`runsc`), a pinned builder image and quota-limited volumes; repository bytes are copied in, never bind-mounted. ([`build_executor.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/build_executor.rs))
3. **Immutable deployment.** The result is a content-addressed deployment with its own URL; production is an alias, so promote and rollback are alias moves.
4. **Place.** Without a marketplace order, DevHub places on healthy platform nodes. With an order, it snapshots the validated placement policy and only uses its approved node IDs. ([compute marketplace](./compute-marketplace.md#placement-policy-v1))
5. **Distribute to the mesh.** Sealed runtime artifacts move to the chosen L0 nodes; platform state replicates over the iroh mesh through GuardianDB; nodes coordinate by gossip. ([Layer 0 mesh](./l0-mesh.md))
6. **Serve.** The fluid gateway routes each request to a static asset or a warm Fluid instance over a multiplexed tunnel; DNS answers with the node nearest the client.
7. **Meter.** Active CPU, memory, requests and GPU time accumulate per tenant. ([developer usage](./developer-usage.md))
8. **Settle.** Plans and usage are paid in THEO; marketplace orders settle through the fee-split contract, verified against the L1. ([THEO economy](./theo-economy.md))

::: warning Evidence level
Steps 1–7 are implemented in DevHub source at `29abc9f` and power dev.autheo.com, but these docs did not run a signed-in deployment. Step 8 is source-backed against the testnet profile; mainnet settlement is planned. See [roadmap](./roadmap.md).
:::

## Where agents fit

Agents are DevHub users like any other: the [agentic OS](./build.md#_4-agentic-os) gives them tools ([Autheo MCP](../mcp/index.md)), identity and mandates ([agent trust](../concepts/agent-trust.md)), and models served from the L0 GPU pool. Their actions deploy to the same mesh and settle through the same L1.
