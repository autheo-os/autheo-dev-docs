# Autheo MCP server

[autheo-os/autheo-MCP](https://github.com/autheo-os/autheo-MCP) is a **read-only** [Model Context Protocol](https://modelcontextprotocol.io) server that lets an AI client (Claude Desktop, Claude Code, OpenClaw or any MCP stdio host) inspect Autheo DevHub, the Marketplace, the chain and the agent trust layer. The tool list is in the generated [MCP tool reference](./tools.md).

::: warning Prototype, not a live-service guarantee
The repository README states that the implementation was verified with local contract fixtures and real MCP stdio sessions, "not proof of access to a live Autheo installation". Every tool only calls the endpoints you configure. Nothing is enabled automatically.
:::

## What it can do

From the repository README at commit `6634165` (version `0.3.0a1`):

| Area | Read-only capability |
| --- | --- |
| Marketplace | Public listings, listing detail and capacity; with a buyer session: orders, placement policies, settlement status; with a provider session: profile, listings, node bindings, orders, reward accounting |
| DevHub (Layer 0) | Nodes, deployments and their resources, deployment-derived project discovery and settings, builds and log tails, overview, cluster, mesh, security and wallet reads |
| Private bridge | HMAC-signed L0 advertisement reads, optional private CA and client certificate for the gateway's mTLS |
| Estimates | Exact-decimal listing price estimates marked `authoritative_quote: false`. No reservation, checkout, payment, allocation, purchase or deployment is created |
| Chain | CometBFT RPC reads and independently configured Cosmos REST reads |
| THEO display price | From Marketplace `/api/market/theo` or an explicit JSON feed; stale or unavailable values are not used for conversions |
| Agent trust (optional) | Five inspection tools and `autheo://agent-trust` that verify a short-lived signed summary from the [Autheo Agent Environment](https://github.com/autheo-os/autheo-agent-environment) with an operator-pinned key |

It exposes **no** private keys, wallet custody, payments, approval overrides, mandate issuance or transactions.

## Install

Needs Python 3 and git.

```bash
git clone https://github.com/autheo-os/autheo-MCP.git
cd autheo-MCP
python -m venv .venv
. .venv/bin/activate            # Windows: .venv\Scripts\activate
python -m pip install -e '.[dev]'      # add ,trust for the agent trust tools: '.[dev,trust]'
autheo-mcp                      # or: python -m autheo_mcp.server
```

The server speaks MCP over stdio, so you normally let your client start it rather than running it yourself.

## Configure

All configuration comes from the **process environment**. `.env.example` documents the names but is not loaded automatically. Never put credentials in tool arguments.

| Variable | Meaning / default |
| --- | --- |
| `AUTHEO_DEVHUB_URL` | Private Hive admin origin; default `http://127.0.0.1:8786` |
| `AUTHEO_HIVE_JWT` / `AUTHEO_HIVE_API_KEY` | DevHub bearer identity; the JWT wins if both are set |
| `AUTHEO_HIVE_TEAM` | DevHub team; default `personal`; never forwarded to the Marketplace |
| `AUTHEO_MARKETPLACE_API_URL` | Marketplace application origin; unset by default |
| `AUTHEO_MARKETPLACE_BEARER_TOKEN` | A valid Clerk Marketplace session for buyer/provider reads (expires; refresh through the deployment's sign-in flow) |
| `AUTHEO_MARKETPLACE_URL` | Private DevHub bridge origin (not the public Marketplace) |
| `AUTHEO_MARKETPLACE_HMAC_KEY_ID` / `AUTHEO_MARKETPLACE_HMAC_SECRET` | Private bridge signing credentials |
| `AUTHEO_MARKETPLACE_CA_FILE`, `AUTHEO_MARKETPLACE_CERT_FILE` / `AUTHEO_MARKETPLACE_KEY_FILE` | Private gateway CA and client certificate (set cert and key together) |
| `AUTHEO_RPC_URL` | CometBFT RPC; default `http://127.0.0.1:26657` |
| `AUTHEO_REST_URL` | Cosmos REST base; default `http://127.0.0.1:1317` |
| `AUTHEO_PRICE_FEED_URL` | Optional JSON feed `{price_usd, status: "live"}` |
| `AUTHEO_REQUEST_TIMEOUT` | Seconds per HTTP request; default 30 |
| `AUTHEO_NETWORK` | Display label only; default `autheo-mainnet` |

Endpoints without a public URL in this documentation (DevHub admin, private bridge) are operator-provided. See [Networks](../reference/networks.md) for published chain endpoints and [Status](../reference/status.md) for what is verified.

## Connect a client

Use the absolute path of the virtual environment's `autheo-mcp` executable and pass configuration in `env`.

### Claude Desktop

Add to `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "autheo": {
      "command": "/path/to/autheo-MCP/.venv/bin/autheo-mcp",
      "env": {
        "AUTHEO_RPC_URL": "https://your-rpc.example",
        "AUTHEO_MARKETPLACE_API_URL": "https://your-marketplace.example"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add autheo --env AUTHEO_RPC_URL=https://your-rpc.example -- /path/to/autheo-MCP/.venv/bin/autheo-mcp
```

### OpenClaw and other stdio hosts

Register a stdio MCP server whose command is the same `autheo-mcp` path and whose environment carries the variables above. In OpenClaw this goes in the MCP servers section of the Gateway configuration.

## First tools to try

1. `autheo_get_integration_guide` and `autheo_get_server_info`: local setup and capability map, no network.
2. `autheo_marketplace_list_listings`: commercial supply with optional type/region filters.
3. `autheo_marketplace_get_listing` and `autheo_marketplace_estimate_listing`: detail and local arithmetic.
4. `autheo_devhub_list_deployments`, `autheo_devhub_get_build_logs`, `autheo_devhub_status`: infrastructure inspection.

Resources: `autheo://network`, `autheo://marketplace`, `autheo://capabilities`, `autheo://integrations` (and `autheo://agent-trust` with the trust extra).

## Verify your install

```bash
python -m pytest tests -q
python review/smoke_upgrade.py   # calls all tools against localhost fixtures over real stdio
```

## Licensing

The MCP package is MIT. Upstream repositories it was built against keep their own terms; DevHub's `LICENSE.md` is restrictive and is not MIT.
