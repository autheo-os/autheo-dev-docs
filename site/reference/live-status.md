# What is live (dated probes)

This page records what anonymous HTTP requests returned on **2026-10-12 (about 18:20 America/Denver)**. It is a snapshot, not a monitoring service. For which capabilities are backed by source code, see the [status matrix](./status.md).

## dev.autheo.com (Autheo DevHub)

| URL | Result | Meaning |
| --- | --- | --- |
| `/`, `/docs`, `/docs/getting-started`, `/docs/api-reference` | 200 | Public site and docs are served |
| `/pricing`, `/status`, `/blog` | 200 | Public pages are served |
| `/llms.txt` | 200 | Served; still describes the product under its earlier working name |
| `/api/market-reference/theo` | 200, JSON | THEO display price feed (see [THEO](../concepts/theo.md)) |
| `/projects`, `/deployments`, `/run-node` | 307 → `/sign-in` | Dashboard; needs an account |
| `/marketplace` | 307 → `/integrations` | Marketplace entry point moved under integrations |

## API hosts

| Host | Result |
| --- | --- |
| `https://api.shadw.cloud/healthz` | 200 (`ok`): the DevHub API host the dashboard's API reference currently uses (legacy name) |
| `https://api.autheo.dev` | No connection (does not resolve), although the live getting-started page names it |
| `https://autheo.dev` | No connection, although page metadata names it as the organisation URL |

## Related sites

| Site | Result |
| --- | --- |
| [autheo.com](https://www.autheo.com) | 308 → www.autheo.com |
| [autheo-stack.shadw.app](https://autheo-stack.shadw.app) | 200: architecture narrative |
| [autheo-mcp-site.vercel.app](https://autheo-mcp-site.vercel.app) | 200: MCP marketing site, still shows v0.2 (39 tools); the [generated reference](../mcp/tools.md) is current |
| [This documentation](https://autheo-os.github.io/autheo-dev-docs/) | 200 (GitHub Pages) |

## Not checked

Chain RPC/REST endpoints, validator liveness and anything behind sign-in were not tested. The [Autheo MCP](../mcp/index.md) has been verified against local fixtures only.
