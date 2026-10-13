# FAQ

**What is Autheo?**
A Cosmos SDK / CometBFT blockchain with EVM support, plus a developer cloud ([DevHub](../devhub/index.md)) that runs workloads on a peer-to-peer compute fabric, a resource [Marketplace](../components/marketplace.md) priced in THEO, agent tooling ([Autheo MCP](../mcp/index.md)) and an agent trust layer ([Identity and agent trust](../concepts/agent-trust.md)). The [ecosystem overview](../concepts/ecosystem.md) shows how they relate.

**Is dev.autheo.com live?**
Partly. On 2026-10-12 the public pages (home, docs, pricing, status, blog) were served and the dashboard required sign-in. Details: [DevHub → What is live today](../devhub/index.md#what-is-live-today).

**What is the API base URL?**
The dashboard's API reference uses `https://api.shadw.cloud`, which answered `/healthz` with `ok` on 2026-10-12. The live getting-started page names `https://api.autheo.dev`, which did not resolve that day. A self-hosted node serves the API on `http://127.0.0.1:8786`.

**Why do I see "shadw" everywhere?**
shadw is DevHub's name inside the code: the CLI is `shadw`, configuration lives in `~/.shadw/`, and the API host is `api.shadw.cloud`. The node software is called Hive. The `autheo` CLI shown in the DevHub README does not exist yet.

**How do I deploy something?**
Sign in at dev.autheo.com, create an API key, then use `shadw deploy` or `POST /v1/git/deploy`. See [DevHub](../devhub/index.md#deploy-with-the-cli).

**Can I host a game server?**
Yes, DevHub has game server presets (for example Team Fortress 2, Don't Starve Together, GoldenEye: Source) with a guided setup in the dashboard.

**Can my AI agent use Autheo?**
Yes, read-only, through the [Autheo MCP server](../mcp/index.md): 44 tools covering Marketplace, DevHub, chain reads, THEO display price and agent-trust inspection. It sends no transactions and was verified against local fixtures, not a live installation.

**Can an agent spend money or sign transactions?**
No. Neither the MCP server nor the agent trust prototype holds wallet keys, makes payments or executes transactions. Agent trust budgets are simulated DEMO units.

**Do I need to register an identity for my agent?**
No. Agent identities are `did:key` DIDs you create offline. Authority comes from a signed delegation chain back to a root DID the verifier trusts. See [Identity and agent trust](../concepts/agent-trust.md).

**Where is THEO priced?**
DevHub/Marketplace expose a THEO reference price (`/api/market-reference/theo` on dev.autheo.com returned JSON on 2026-10-12). The MCP tools refuse to convert with stale or unavailable prices.

**Is the code open source?**
It varies: Autheo MCP and the Agent Environment are MIT. DevHub's `LICENSE.md` is restrictive and is not MIT. Check each repository.

**Something here is wrong or out of date.**
Every page lists its sources in `provenance.json`. Open an issue or pull request on [autheo-os/autheo-dev-docs](https://github.com/autheo-os/autheo-dev-docs); see [Contributing](../contributing/index.md).
