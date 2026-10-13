# Implementation checklist — ecosystem docs expansion (started 2026-10-12)

Resume file for agents working on this expansion. Update it in **every** commit.
Rules: evidence-only (every fact cites a repo file, live URL fetched on a stated date, or an
existing reviewed page); unverified features are labelled **planned / not yet available**;
commit as SolutionsAsService; small verified pushes to `main`; run `npm run check` and
`node scripts/provenance.mjs` before each push.

## Working conventions

- Markdown source: `site/**.md`; every page must be listed in `publication.json` and `provenance.json`
  (added pages: `sourceSha256: null`, `added`, `sources`). Refresh hashes with
  `node scripts/provenance.mjs --update`.
- The 23 pages reviewed on 2026-10-09 keep `sourceSha256`; editing one requires an `adaptation` note.
- Generated: root `*.html`, `assets/search-index.js` (`npm run docs:build`). Commit them with the source.
- MCP tool reference is generated: `node scripts/gen-mcp-reference.mjs --source <autheo-MCP checkout>`
  (never hand-edit `site/mcp/tools.md` or `data/mcp-tools.json`).
- Source checkouts used for this work (not committed): autheo-os/autheo-MCP, autheo-os/L0_devhub_deploy,
  autheo-os/autheo-agent-environment + SolutionsAsService/autheo-agent-environment (v0.3),
  autheo-os/autheo-stack, autheo-os/theo-atlas, autheo-os/autheo-mcp-site, SolutionsAsService/JARVIS.

## Steps

- [x] 0. Baseline: existing 23-page build/tests pass (2026-10-12).
- [x] 1. Infra: page counts derived from manifest; per-page `reviewed` date; provenance supports added pages
      (`scripts/provenance.mjs`); CI workflow `.github/workflows/verify.yml` (build + tests + internal links +
      regeneration diff; advisory external link check `scripts/check-links.mjs`).
- [x] 2. Gap audit: `docs/implementation/gap-audit.md`.
- [ ] 3. Status page: `reference/live-status.md` (dev.autheo.com live vs planned, dated probes).
- [~] 4. MCP (pages done; CI drift job pending): generator `scripts/gen-mcp-reference.mjs` → `site/mcp/tools.md` + `data/mcp-tools.json`;
      `site/mcp/index.md` (install/config for Claude Desktop, Claude Code, OpenClaw, generic stdio); CI drift job.
- [ ] 5. DevHub (Layer 0): concept page, deploy guide, REST reference generated from `ui/lib/api-catalog.ts`
      cross-checked against `crates/hive-cloud` routes, CLI reference (`shadw`, `hivectl`, `fluidctl`, `hive-cloud`).
- [ ] 6. Identity / agent trust: concept (did:key, delegation, revocation), guide (CLI walkthrough), API reference.
- [ ] 7. AOS stack concept (JARVIS catalog + autheo-stack narrative); THEO token/market data note (theo-atlas).
- [ ] 8. Security overview, FAQ, glossary additions, changelog; nav/IA regroup; home + getting-started cross-links.
- [ ] 9. README/deployment page updates; final full check, CI green, Pages deploy verified live.

## Log

- 2026-10-12: steps 0–2 committed.
- 2026-10-12 18:xx: step 4 MCP pages (mcp/index.md install/config/clients, generated mcp/tools.md from autheo-MCP@6634165; 44 tools, 5 resources) published; 25 pages, tests 14/14.
