# Go-to-market roadmap and status

This page tracks every box in the [platform map](./index.md) against the go-to-market order (1 DevHub, 2 app ecosystem, 3 compute/storage marketplace). It records **evidence**, not promises: "planned" means nobody has shown it working yet, not that it will never ship. Last updated **2026-10-12**.

## Scorecard

| Box | Live (probed) | Source-backed | Planned / gaps |
| --- | --- | --- | --- |
| **1 · DevHub IDE toolkit** | dev.autheo.com public site, docs, pricing; dashboard behind sign-in; API host `api.shadw.cloud` | Deploys, previews, rollback, domains, data, logs, CLI, local node | Rebrand remaining *shadw* identifiers; make `api.autheo.dev` resolve |
| **1 · Full-stack SDKs** | REST API | Vercel-compatible TS client, agent-trust Python/JS, MCP server | First-party typed Autheo SDKs (TS, Python, Rust) under one auth model |
| **1 · Workflow / DAG tool** | `/workflows` (sign-in) | Durable runs, graph manifest, replay/cancel/wakeup, console | Visual DAG editor; agent-authored workflows |
| **1 · Agentic OS** | — | JARVIS stack catalog, Autheo MCP (44 tools), agent trust, GPU inference | Joined agent path: plan → policy → MCP → DevHub → receipt |
| **2 · App ecosystem** | — | Immutable releases with capabilities/revocation; game presets; templates | Public storefront, publisher payouts, review policy |
| **3 · Compute/storage marketplace** | — (`marketplace.autheo.dev` unresolved) | Listings link-out, placement policy v1, private HMAC routes, browser and self-hosted nodes | Capacity holds, allocation callbacks, usage ingestion, public host |
| **Developer usage** | Pricing in THEO | Rate card metering, ledger, THEO wallet checkout | Metered marketplace usage streams |
| **THEO** | Display price feed `/api/market-reference/theo` | Fee-split settlement V2 verification | Mainnet settlement profile |
| **L1 testnet** | RPC (chain 785) and explorer answered | Settlement profile `autheo-testnet-v1` | Published testnet token/contract addresses, faucet docs |
| **L1 mainnet** | Not probed | Published config `autheo_2127-1` | Verified public RPC/EVM chain ID; settlement on mainnet |

## What would move each box to "live"

- **DevHub:** a public walkthrough (sign-up → deploy → custom domain) recorded against dev.autheo.com, and the CLI published under the Autheo name.
- **App ecosystem:** one published release that a second account deploys and pays for in THEO on testnet.
- **Marketplace:** one provider listing, one buyer order, a placement-pinned deployment and a verified `Settlement` event on testnet, all on public hosts.
- **Mainnet:** an approved settlement profile, published contract addresses and an audit reference.

When one of these happens, update this page, the [live status](../reference/live-status.md) page and the [changelog](../reference/changelog.md) in the same commit.
