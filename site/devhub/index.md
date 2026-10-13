# DevHub (Layer 0)

DevHub, published at [dev.autheo.com](https://dev.autheo.com), is Autheo's developer cloud: Git deployments, serverless functions, containers, static sites, databases, cron jobs, workflows, domains, logs and game servers, run on a peer-to-peer compute fabric instead of a single cloud region. Its code is the `L0_devhub_deploy` repository; the internal product name in code and CLI is **shadw**, and the node software is called **Hive**.

This page covers what is implemented and how to use it. The generated [DevHub API and CLI reference](./api.md) lists every endpoint and command.

::: info Which repository
The actively developed copy is [ThothDivision/L0_devhub_deploy](https://github.com/ThothDivision/L0_devhub_deploy) (commit `29abc9f`, 2026-10-12). [autheo-os/L0_devhub_deploy](https://github.com/autheo-os/L0_devhub_deploy) was last updated 2026-10-08 (`405075e`). Facts below come from the newer copy.
:::

## How it is built

The repository README describes these layers, top to bottom:

| Layer | What it contains |
| --- | --- |
| Developer experience | CLI, SDKs, Git, dashboard, APIs, templates, docs |
| Application runtime | Functions, containers, static apps, services, AI |
| Distributed compute | "Fluid compute", warm pools, autoscaling, microVMs |
| Compute fabric | Cloud, edge, private, community and mobile/IoT nodes |
| Data fabric | CRDTs, local state, replication, storage, databases |
| Network fabric | Iroh/QUIC peer-to-peer, relays, DNS, anycast, edge routing |
| Identity and trust | Node identity, encryption, veritas reputation, attestation |
| Resource marketplace | Compute, storage, bandwidth, hosting priced in THEO |
| Autheo network | Cosmos SDK, IBC, EVM, CometBFT |

In code these map to Rust crates such as `hive-cloud` (the node and its admin REST API), `hive-p2p`, `hive-edge`, `hive-crsql` (CRDT SQLite), `fluid-compute`, `fluid-gateway`, and the CLIs `shadw-cli`, `hivectl` and `fluidctl`; the dashboard is the Next.js app in `ui/`.

::: warning Design direction vs shipped
Post-quantum key agreement, hardware attestation, veritas reputation and on-chain settlement are described in the README as design direction. Marketplace ↔ DevHub integration has four private HMAC routes implemented; capacity holds, allocation status, usage ingestion and callbacks are documented in `docs/openapi/README.md` but **not implemented**.
:::

## What is live today

Checked anonymously on 2026-10-12:

| Surface | Result |
| --- | --- |
| `https://dev.autheo.com/` and marketing/docs pages (`/docs`, `/features`, `/pricing`, `/status`, `/blog` …) | Served (HTTP 200) |
| Dashboard routes (`/projects`, `/deployments`, `/new`, `/settings/api-keys`, `/run-node` …) | Redirect to `/sign-in`; an account is required |
| `/api`, `/api/market/theo` on dev.autheo.com | 404 |
| `https://api.shadw.cloud/healthz` (base URL in the dashboard's API reference) | Returned `ok` |
| `https://api.autheo.dev` (named on the live getting-started page) | Did not resolve (DNS) |

So today you use DevHub through the signed-in dashboard, or through the API/CLI with an API key created in the dashboard. See [Status](../reference/status.md) for the wider evidence matrix.

## Authentication

Every API request carries `Authorization: Bearer <key>`, which scopes it to your team. Create keys under **Settings → API keys** in the dashboard, or with `POST /v1/apikeys` once you hold a key. Dashboard sign-in uses Clerk.

## Deploy with the CLI

The CLI in the repository is `shadw` (built from `crates/shadw-cli`; the README's `autheo login / deploy` examples describe an intended CLI name that does not exist yet).

```bash
# configure once (writes ~/.shadw/config.json), or export the variables below
shadw auth
export SHADW_API_URL=https://api.shadw.cloud   # default: http://127.0.0.1:8786 (local node)
export SHADW_TOKEN=<api key>
export SHADW_TEAM=<team slug>                  # optional

shadw deploy                 # clone → build → deploy a Git repository
shadw build                  # build status and streamed logs
shadw deployments            # list, promote (rollback), delete
shadw projects               # settings, env vars, redeploy, domains
shadw observability          # overview, logs, resources, metrics, regions, nodes
shadw api                    # call any endpoint directly
```

Run `shadw <command> --help` for flags. The full command list is in the [reference](./api.md#shadw-cli-commands).

## Deploy with the API

The core flow uses four endpoints from the [reference](./api.md):

1. `POST /v1/git/deploy` starts a build from a Git repository.
2. `GET /v1/builds/{id}` polls build status and logs.
3. `POST /v1/deployments/{id}/promote` makes a deployment live (also used to roll back).
4. `POST /v1/projects/{project}/env` and `POST /v1/projects/{project}/domains` configure environment variables and domains.

## Game servers

DevHub ships game server presets (for example Team Fortress 2, Don't Starve Together and GoldenEye: Source) with a guided setup in the dashboard. Each preset pins an upstream container image; see `docs/game-server-presets.md` in the repository.

## Run a node

Operators can contribute compute by running a Hive node. The dashboard's **Run a node** page (signed in) walks through it; the general model is in the [node operator guide](../guides/node-operator.md). The repository's `RUNBOOK.md` and `docs/LIVE_INFRA_RUNBOOK.md` cover self-hosting.

## Use DevHub from an AI agent

The [Autheo MCP server](../mcp/index.md) exposes read-only DevHub tools (deployments, builds and logs, nodes, cluster and mesh status) when you set `AUTHEO_DEVHUB_URL` and a DevHub key.

## Licence

DevHub's `LICENSE.md` is restrictive (an "Open BSL"-style licence, per the repository description); it is not MIT.
