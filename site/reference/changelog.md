# Documentation changelog

Changes to this documentation site. Product release notes live in each product repository.

## 2026-10-12

- **Naming:** DevHub pages use Autheo DevHub / dev.autheo.com throughout and cite autheo-os/L0_devhub_deploy (now synced to `29abc9f`); *shadw* appears only where code identifiers still use it.
- **New: MCP server section.** Install, configuration and client setup for [Autheo MCP](../mcp/index.md), plus a [tool reference](../mcp/tools.md) generated from autheo-MCP `6634165` (44 tools, 5 resources).
- **New: DevHub (Layer 0) section.** [Overview](../devhub/index.md) with dated live-status probes of dev.autheo.com, authentication, CLI and API deploy flow, and an [API and CLI reference](../devhub/api.md) generated from L0_devhub_deploy `29abc9f` (34 endpoints, 14 `shadw` commands).
- **New concept pages:** [Identity and agent trust](../concepts/agent-trust.md) (DIDs, delegation chains, receipts, local trust service) and [The Autheo agent operating stack](../concepts/aos-stack.md).
- **New:** [FAQ](./faq.md) and this changelog.
- **Build:** page counts come from `publication.json`; `provenance.json` records sources for added pages; CI verifies the build, internal links, provenance, and that both generated references match their data.

## 2026-10-09

- Initial 23-page review published as plain HTML with local search.
