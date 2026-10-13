# Compute and storage marketplace (surface 3)

The marketplace sits between the [Autheo L1](./l1-networks.md) and the [Layer 0 mesh](./l0-mesh.md): it is where L0 capacity is bought and sold, and where those orders settle on the L1: **buyers** (developers) attach compute or storage to a DevHub project, and **providers** (node operators) supply it and get paid in THEO. It is the third go-to-market surface.

This page documents the integration that exists in DevHub source at commit `29abc9f` ([autheo-os/L0_devhub_deploy](https://github.com/autheo-os/L0_devhub_deploy)). The commercial Marketplace application itself is a separate service; for its intended design (offers, matching, disputes) see [Marketplace design](../components/marketplace.md).

## Status at a glance (2026-10-12)

| Capability | Status |
| --- | --- |
| Listings by resource type (`compute`, `storage`) linked from a DevHub project | **Source-backed** |
| Placement policy v1: an order pins which nodes may run the workload | **Source-backed** |
| Private DevHub ↔ Marketplace service routes (HMAC-signed) | **Source-backed** |
| THEO settlement on Autheo testnet (MarketplaceAtomicFeeSplit V2) | **Source-backed**, enabled only by an explicit profile |
| Public Marketplace host | `marketplace.autheo.dev` did **not resolve** on 2026-10-12; `/marketplace` on dev.autheo.com redirects to `/integrations` (sign-in) |
| Capacity holds, allocation status callbacks, usage ingestion | **Planned** (deliberately not implemented yet) |

## What can be bought

DevHub models two resource types ([`ui/lib/marketplace.ts`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/lib/marketplace.ts)):

- **compute**: vCPU, memory, disk and execution slots on approved provider nodes; GPU capacity comes from DevHub's GPU pool, grouped by region ([`gpu_pool.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/gpu_pool.rs)).
- **storage**: capacity for project data. On the platform side, tenant storage operations go through one storage broker that checks ownership, identifier safety, then capacity, in that order ([`storage_broker.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/storage_broker.rs)).

A third listing type, `game_hosting`, is accepted by the Marketplace but needs a verified provider, an active binding and a healthy DevHub advertisement before it can be quoted. Demo cards are not purchasable capacity ([`docs/marketplace-game-hosting-integration.md`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/docs/marketplace-game-hosting-integration.md)).

## Buyer flow: attach capacity to a project

1. In a DevHub project, choose **Marketplace** (or **New Project → Deploy from Marketplace**).
2. DevHub sends you to `{marketplace}/listings?project=…&resource_type=compute|storage&return_url=…`.
3. You sign in to the Marketplace (its own account flow) and place an order.
4. The Marketplace returns you to the project with `marketplace_order=<id>`; DevHub attaches the order to the project.
5. When you deploy with that order, DevHub fetches the order's **placement policy**, validates it, and snapshots it into the deployment. Only the approved nodes may run it.

Source: [`docs/marketplace-project-resources.md`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/docs/marketplace-project-resources.md), [`docs/devhub-marketplace-placement-policy.md`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/docs/devhub-marketplace-placement-policy.md).

### Placement policy v1

A policy names the order, the buyer tenant, status and revocation state, a validity window, `approved_node_ids`, provider, listing, region, resources (`vcpu`, `memory_mb`, `disk_gb`) and commercial terms. DevHub rejects it if any of these hold:

- unknown contract or policy version;
- tenant or order mismatch with your signed-in session;
- not `active`, revoked, or outside its validity window;
- malformed fields, or fields that look like addresses, credentials or control-plane data.

Approved node IDs are a **hard allowlist**. If none of them is healthy, reachable and has capacity, the deployment fails with `MARKETPLACE_PLACEMENT_UNAVAILABLE`. DevHub never falls back to an unapproved node.

## Provider flow: supply capacity

There are two ways capacity joins the mesh today:

- **Self-hosted nodes:** run the `hive-cloud` node on your own machines (bare metal, Firecracker microVMs, Macs). Enterprise plans include self-hosted nodes and data residency ([pricing](https://dev.autheo.com/pricing)). See [node preparation](../guides/node-operator.md) for chain validators and [provider preparation](../guides/provider-design.md) for compute providers.
- **Browser nodes (`/run-node`):** a signed-in user can donate a browser tab as a mesh node. It holds a relay identity, can serve browser-eligible functions under strict limits, or replicate a project database ([`ui/lib/run-node-targets.ts`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/lib/run-node-targets.ts)). Requests served by browser nodes are counted but **not billed** today.

Marketplace never becomes a mesh peer: it gets no node keys, relay credentials, tenant workloads or private topology ([`docs/marketplace-l0-routing.md`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/docs/marketplace-l0-routing.md)).

## How the two services talk

| Direction | Route | Auth |
| --- | --- | --- |
| DevHub → Marketplace | `GET /v1/marketplace/orders/{id}/placement-policy` | Marketplace session token for the signed-in buyer |
| Marketplace → DevHub | `GET /v1/marketplace/l0/deployments` | Timestamped HMAC with nonce replay protection |
| Marketplace → DevHub | `POST /v1/marketplace/payment-intents` | same |
| Marketplace → DevHub | `POST /v1/marketplace/payments/verify` | same |
| Marketplace → DevHub | `POST /v1/marketplace/l0/allocations` | same |
| Marketplace → DevHub | `POST /v1/marketplace/workloads`, `/workload-intents/v2` | same |

Allocations carry settlement and resource facts only, never repository URLs, images or build settings. Workloads attach to an immutable, published **release** of a project (see [app ecosystem](./app-ecosystem.md#releases-the-unit-of-distribution)).

## Settlement

Orders are paid in THEO through the MarketplaceAtomicFeeSplit V2 contract: one transaction splits the gross amount between the provider and the platform fee recipient (fee 500 bps = 5%), and emits a `Settlement` event that DevHub verifies after 2 confirmations. Details: [THEO economy](./theo-economy.md#marketplace-settlement).

## Known gaps

From DevHub's own design notes: the four private routes do **not** provide capacity holds, allocation status, callbacks or usage ingestion. Fleet-wide capacity reservation is intentionally unimplemented until a store with conditional writes exists, to avoid selling the last unit twice ([`marketplace_reservations.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/marketplace_reservations.rs)). Do not treat a successful allocation as a capacity guarantee.

## Next

[Developer usage and billing](./developer-usage.md) · [THEO economy](./theo-economy.md) · [Marketplace design](../components/marketplace.md)
