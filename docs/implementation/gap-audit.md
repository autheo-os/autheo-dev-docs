# Documentation gap audit — 2026-10-12

Scope: autheo-os/autheo-dev-docs (23 reviewed pages, 2026-10-09) versus the Autheo ecosystem
repositories and what https://dev.autheo.com actually serves. Probes were plain HTTP GETs on
2026-10-12 (America/Denver); signed-in pages were not exercised. Nothing here is a load,
security or uptime test.

## 1. What the existing docs cover

| Area | Existing page(s) | Evidence level |
| --- | --- | --- |
| Chain (Cosmos SDK / CometBFT / Ethermint) | concepts/architecture, reference/api, reference/networks, guides/integration, guides/node-operator | Source-backed, pinned commits in autheo-blockchain repos |
| L0 Mesh, Connectivity, DevHub/OpenEdge, Marketplace, Freddie | components/* | Design / planned only (written from planning docs, before the DevHub repo was reviewed) |
| Ecosystem roles and flows | concepts/ecosystem, concepts/data-flows, guides/application-lifecycle, guides/provider-design | Design / planned |
| Docs maintenance | contributing, deployment, troubleshooting | Accurate for this repo |

## 2. Ecosystem components with no docs (before this expansion)

| Component | Source | What exists in code | Gap |
| --- | --- | --- | --- |
| DevHub / Layer 0 platform ("Hive" node, shadw) | autheo-os/L0_devhub_deploy (`crates/hive-cloud`, `ui/`, `crates/shadw-cli`) | Rust node binary `hive-cloud`, admin REST API (default `127.0.0.1:8786`), CLIs `shadw`, `hivectl`, `fluidctl`, Next.js dashboard, private Marketplace bridge (HMAC), OpenAPI for private/internal surfaces | Existing components/devhub page describes a *design*; no page documents the implemented API, CLI, auth model, self-hosting or the live dev.autheo.com deployment |
| Autheo MCP server | autheo-os/autheo-MCP (`src/autheo_mcp/server.py`) | Python FastMCP stdio server, 44 read-only tools, 5 resources, env-var configuration | No MCP docs at all; tool list must be generated from code because a sibling effort is changing it |
| Agent trust layer (passports, mandates, DIDs, delegation) | autheo-os/autheo-agent-environment (0.1, Oct 4) and SolutionsAsService/autheo-agent-environment (0.3, Oct 12) | Local reference prototype: CLI, loopback HTTP API, did:key, VC 2.0 delegation chains, revocation, offline verifiers (Python + JS) | No identity / DID / agent-trust docs |
| AOS stack (JARVIS) | SolutionsAsService/JARVIS (`src/aos-stack.js`) | Catalog of integrated / adapter / planned components; Autheo env adapter (off by default) | No page explaining how agent runtimes plug into Autheo pieces |
| Autheo stack narrative | autheo-os/autheo-stack (live at autheo-stack.shadw.app) | Static architecture page | Not linked from docs |
| THEO market monitor | autheo-os/theo-atlas | Local read-only market monitor; THEO contract addresses on Base and Robinhood Chain sourced from autheo.com/token-launch | Not referenced |
| MCP marketing site | autheo-os/autheo-mcp-site (autheo-mcp-site.vercel.app) | Static catalog snapshot of **v0.2 (39 tools)** | Out of date versus MCP code (44 tools); docs should point to generated reference |

## 3. What dev.autheo.com serves today (2026-10-12)

Public (HTTP 200, content rendered): `/`, `/docs`, `/docs/getting-started`, `/docs/api-reference` (+ per-endpoint pages),
`/docs/errors/deployment-not-found`, `/features`, `/product`, `/solutions`, `/pricing`, `/status`, `/blog`,
`/case-studies`, `/contact`, `/privacy`, `/sign-in`, `/sign-up`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`,
`/api/market-reference/theo` (JSON).

Redirect to sign-in (dashboard, not testable anonymously): `/projects`, `/deployments`, `/new`, `/settings/api-keys`,
`/network`, `/regions`, `/run-node`, `/marketplace` (→ `/integrations`).

Inconsistencies found on the live site:

- `/docs/getting-started` says the API lives at `https://api.autheo.dev`; on 2026-10-12 `api.autheo.dev` did **not resolve**
  (DNS ENOTFOUND). `/docs/api-reference` and the per-endpoint pages use `https://api.shadw.cloud`, whose `/healthz` returned `ok`.
- `/llms.txt` describes the product as **shadw** and links to shadw.cloud docs, not dev.autheo.com.
- JSON-LD on every page names `https://autheo.dev` as the organization URL; `autheo.dev` refused HTTPS connections.
- `/status` shows "All Systems Operational" derived from the incident feed (`/v1/incidents`); in the UI code an
  unavailable feed renders the same empty-incident state, so it is not an independent health probe.
- The README of L0_devhub_deploy shows `autheo login / deploy / logs …` as the intended developer experience; the CLI
  that actually exists in the repo is `shadw` (plus `hivectl`/`fluidctl`). No `autheo` CLI binary exists in the repo.

## 4. Partial / planned (must be labelled so in docs)

- Marketplace ↔ DevHub: four private HMAC routes implemented; the operational contract (capacity holds, allocation
  status, usage ingestion, callbacks) is documented but **not implemented** (`docs/openapi/README.md`).
- Settlement on the Autheo chain from DevHub/Marketplace: design only. MCP reads chain data but sends no transactions.
- Agent trust: local simulation; no wallet, payments, on-chain anchoring, hosted revocation, production key custody.
- Autheo MCP: verified against local fixtures, "not proof of access to a live Autheo installation" (MCP README).
- Post-quantum key agreement, attestation, veritas reputation: described in DevHub README as design direction.

## 5. Decisions for the expansion

1. Keep the plain-HTML + local search build; add pages through `publication.json`; keep the 23 reviewed pages' hashes and
   record adaptations explicitly.
2. Add a dated "What's live" status page rather than editing the reviewed status matrix's evidence.
3. Generate (not hand-copy) the MCP tool reference and the DevHub REST endpoint table from the repositories.
4. Cite pinned commits for every repository fact; mark every not-yet-live surface.
