# The Autheo app ecosystem (surface 2)

The app ecosystem is where finished work is **distributed**: apps, packaged services, templates and agents built on DevHub, which other developers and users can deploy or use, paying in THEO. It is the second go-to-market surface. The vision diagram marks it "marketplace?" because its exact shape is still a product decision; this page separates what exists from what is proposed.

## What exists today (source-backed)

### Releases: the unit of distribution

DevHub already has the primitive an app store needs: an immutable **Marketplace release** of a project ([`marketplace_releases.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/marketplace_releases.rs), [`docs/marketplace-workload-contract.md`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/docs/marketplace-workload-contract.md)).

- `POST /v1/projects/{project}/marketplace-releases` creates a release with a platform-issued `release_id`, revision, source and build identity, publication and revocation state, and declared **capabilities**.
- A release is not a deployment: one release can be deployed many times; marketplace allocations bind to the release identity.
- `POST /v1/projects/{project}/marketplace-workloads` attaches a paid allocation to a published, unrevoked release at an exact revision.
- Capabilities are explicit and not inherited. For example, a release that needs a platform-issued client certificate must declare `workload_client_certificate: { mode: files-v1 }`; rolling back to a release without it fails closed.

### Packaged apps

- **Game-server presets:** a catalog of one-click dedicated servers (for example Palworld, Valheim, Arma 3, Team Fortress 2, Don't Starve Together) with a guided setup: basics, world, access (passwords stored as secrets), advanced options ([`ui/lib/game-server-presets.ts`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/lib/game-server-presets.ts)). These are ordinary image deployments today; paid marketplace game hosting is gated (see [compute marketplace](./compute-marketplace.md#what-can-be-bought)).
- **Starter templates:** Bun, Node, Next.js, Hono, Express and a Minecraft server in [`examples/`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/examples).
- **Integrations:** `/integrations` in the dashboard (sign-in) is the current entry point for connected services; GitHub connection is live through a GitHub App or Composio.

### Agents and tools

Agents and MCP tools are distributable artifacts too. The [AOS stack](../concepts/aos-stack.md) catalog and the [Autheo MCP tool reference](../mcp/tools.md) are the current registries.

## Proposed listing types

A public ecosystem storefront is **planned**. The listing types below follow from the release model above; they are a proposal for discussion, not a published catalog.

| Listing type | Built from | Buyer gets | Publisher earns |
| --- | --- | --- | --- |
| App template | A DevHub release | A new project deployed from the release | One-off or per-deploy THEO fee |
| Packaged service (game server, database, CI runner) | A release plus a placement policy | A running service on approved capacity | Share of the hosting order |
| Agent | An AOS agent definition plus mandate template | An agent with a scoped mandate and receipts | Per-task or subscription THEO |
| MCP tool / integration | An MCP server release | A tool connected to their agents | Usage-based THEO |

Open questions the storefront must answer before launch: revenue split and how it settles through the fee-split contract; review and revocation policy for published releases; how a buyer verifies the release they get is the one reviewed (release identity plus build provenance); support boundary between publisher and provider.

## Status

| Piece | Status (2026-10-12) |
| --- | --- |
| Immutable releases with capabilities and revocation | **Source-backed** |
| Game presets and starter templates | **Source-backed**; deployable as ordinary projects |
| Paid packaged hosting through the marketplace | **Gated**: needs verified provider, binding and advertisement |
| Public app storefront, publisher payouts | **Planned** |

## Next

[Plan an application](../guides/application-lifecycle.md) · [THEO economy](./theo-economy.md) · [Developer journeys](./journeys.md)
