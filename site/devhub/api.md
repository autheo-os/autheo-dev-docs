# DevHub API and CLI reference

**Generated from code — do not edit by hand.** Produced by `scripts/gen-devhub-reference.mjs` from [ThothDivision/L0_devhub_deploy](https://github.com/ThothDivision/L0_devhub_deploy) commit [`29abc9f68731`](https://github.com/ThothDivision/L0_devhub_deploy/tree/29abc9f68731963039a2fbfc3371f0237c93d39e) (committed 2026-10-12), files `ui/lib/api-catalog.ts` and `crates/shadw-cli/src/main.rs`.

The catalog lists **34 endpoints** in 8 groups and the `shadw` CLI has **14 top-level commands**. See [DevHub (Layer 0)](./index.md) for authentication, base URLs and what is live.

::: warning Base URL
The catalog documents `https://api.shadw.cloud` as the public base URL. That host was not verified as reachable during this review; a self-hosted node serves the same admin API on `http://127.0.0.1:8786` by default (the CLI's default).
:::

## Endpoints

| Group | Method | Path | Summary |
| --- | --- | --- | --- |
| Deployments | POST | `/v1/git/deploy` | Clone, build and deploy a Git repository. Returns a build id you can stream logs from. The branch (vs the project's production branch) decides production vs preview. |
| Deployments | GET | `/v1/builds/{id}` | Poll a build's status and streamed logs. State is one of building, ready or error. |
| Deployments | POST | `/v1/deployments/{id}/promote` | Promote (or roll back to) a deployment — instantly re-points the production alias to it. No rebuild. |
| Deployments | POST | `/v1/projects/{project}/redeploy` | Rebuild a project's latest source with the current project settings. |
| Deployments | DELETE | `/v1/deployments/{id}` | Delete a single deployment and unregister its functions. |
| Projects | GET | `/v1/projects/{project}/settings` | Read a project's settings (build config, env, domains, production branch, preview protection). |
| Projects | POST | `/v1/projects/{project}/env` | Add or update an environment variable. Sensitive values are encrypted at rest (ChaCha20-Poly1305). |
| Projects | DELETE | `/v1/projects/{project}/env/{key}` | Remove an environment variable from a project. |
| Projects | DELETE | `/v1/projects/{project}` | Delete a project and all of its deployments. |
| Domains | GET | `/v1/domains` | List the custom domains for the active team. |
| Domains | POST | `/v1/projects/{project}/domains` | Attach a custom domain to a project. The domain's root label is aliased to the project's current deployment. |
| Domains | GET | `/v1/domains/{domain}` | Get a domain with its DNS records, nameservers, SSL certificate and connected projects. |
| Domains | PUT | `/v1/domains/{domain}/nameservers` | Set the domain's nameservers (when delegating the whole zone to shadw). |
| Domains | POST | `/v1/domains/{domain}/ssl/renew` | Reissue the free managed (Let's Encrypt-style) certificate for the domain. |
| DNS | POST | `/v1/domains/{domain}/records` | Create a DNS record. shadw's authoritative DNS server answers queries for the domain from these records. |
| DNS | PUT | `/v1/domains/{domain}/records/{id}` | Edit an existing DNS record (system-managed records are immutable). |
| DNS | DELETE | `/v1/domains/{domain}/records/{id}` | Delete a DNS record. |
| DNS | POST | `/v1/domains/{domain}/import` | Bulk-import records (DNS migration) from a list and/or a pasted BIND zone file. Idempotent — exact duplicates are skipped. |
| DNS | GET | `/v1/domains/{domain}/scan` | Detect a domain's CURRENT public DNS records (via DNS-over-HTTPS) so they can be migrated into the console with one click. Records are returned, not added. |
| Webhooks | GET | `/v1/webhooks` | List outbound webhooks for the active team. |
| Webhooks | GET | `/v1/webhooks/events` | List the event types a webhook can subscribe to. |
| Webhooks | POST | `/v1/git/webhook` | Inbound GitHub webhook. A push to the production branch deploys to production; any other branch or a pull request builds a preview. |
| Webhooks | DELETE | `/v1/webhooks/{id}` | Delete an outbound webhook. |
| Teams | GET | `/v1/teams` | List the teams you belong to. |
| Teams | GET | `/v1/teams/{slug}` | Get a team's details, members and plan. |
| Teams | POST | `/v1/teams/{slug}/members` | Invite a member to a team. |
| Teams | DELETE | `/v1/teams/{slug}/members/{email}` | Remove a member from a team. |
| Tokens & API Keys | POST | `/v1/apikeys` | Create a long-lived platform API key (hive_…) bound to the active team. The plaintext token is returned exactly once — only its SHA-256 hash is stored. Present it as `Authorization: Bearer hive_…` to scope requests to the key's team. |
| Tokens & API Keys | GET | `/v1/apikeys` | List the API keys for the active team. Only the display prefix is returned — the full token is shown once at creation and never stored. |
| Tokens & API Keys | DELETE | `/v1/apikeys/{id}` | Revoke an API key. Requests presenting the revoked token stop resolving immediately. |
| Tokens & API Keys | POST | `/v1/token` | Mint a short-lived (8 h) JWT bearer token scoped to a team + role. Requires HIVE_JWT_SECRET to be configured on the node (returns 400 otherwise). When JWT auth is enforced, mutating requests must present a JWT. |
| Observability | GET | `/v1/overview` | Platform overview: deployments, regions, request counters and WAF status. |
| Observability | GET | `/v1/logs` | Recent request + control-plane events for the active team. |
| Observability | GET | `/v1/resources` | Live cluster resource totals (CPU, memory, disk) across the mesh and this node's usage. |

## Deployments

### Create a deployment

`POST /v1/git/deploy`

Clone, build and deploy a Git repository. Returns a build id you can stream logs from. The branch (vs the project's production branch) decides production vs preview.

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `repo_url` | string | yes | Git repository URL to clone and build. |
| `branch` | string | no | Branch to deploy (defaults to the repo's default branch). |
| `project` | string | no | Project name (auto-generated when omitted). |
| `root_dir` | string | no | Subdirectory to build, for monorepos. |
| `target` | "production" \| "preview" | no | Force the environment; omit to classify by branch. |
| `use_cache` | boolean | no | Reuse the dependency build cache (default true). |

### Get a build

`GET /v1/builds/{id}`

Poll a build's status and streamed logs. State is one of building, ready or error.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | The build id returned by Create a deployment. |

### Promote a deployment

`POST /v1/deployments/{id}/promote`

Promote (or roll back to) a deployment — instantly re-points the production alias to it. No rebuild.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | The deployment id to promote. |

### Redeploy a project

`POST /v1/projects/{project}/redeploy`

Rebuild a project's latest source with the current project settings.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project` | string | yes | The project name. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `target` | "production" \| "preview" | no | Environment for the new deployment. |
| `use_cache` | boolean | no | Reuse the existing build cache (default true). |

### Delete a deployment

`DELETE /v1/deployments/{id}`

Delete a single deployment and unregister its functions.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | The deployment id to delete. |

## Projects

### Get project settings

`GET /v1/projects/{project}/settings`

Read a project's settings (build config, env, domains, production branch, preview protection).

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project` | string | yes | The project name. |

### Set an environment variable

`POST /v1/projects/{project}/env`

Add or update an environment variable. Sensitive values are encrypted at rest (ChaCha20-Poly1305).

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project` | string | yes | The project name. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | yes | Variable name. |
| `value` | string | yes | Value (sealed at rest when sensitive). |
| `target` | "production" \| "preview" \| "all" | no | Which environments it applies to. |
| `sensitive` | boolean | no | Encrypt at rest and mask in the UI. |

### Delete an environment variable

`DELETE /v1/projects/{project}/env/{key}`

Remove an environment variable from a project.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project` | string | yes | The project name. |
| `key` | string | yes | The variable name to delete. |

### Delete a project

`DELETE /v1/projects/{project}`

Delete a project and all of its deployments.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project` | string | yes | The project name. |

## Domains

### List domains

`GET /v1/domains`

List the custom domains for the active team.

### Attach a domain to a project

`POST /v1/projects/{project}/domains`

Attach a custom domain to a project. The domain's root label is aliased to the project's current deployment.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project` | string | yes | The project name. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The fully-qualified domain to attach. |

### Get a domain

`GET /v1/domains/{domain}`

Get a domain with its DNS records, nameservers, SSL certificate and connected projects.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |

### Set nameservers

`PUT /v1/domains/{domain}/nameservers`

Set the domain's nameservers (when delegating the whole zone to shadw).

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `nameservers` | string[] | yes | Nameservers to delegate the zone to. |

### Renew the SSL certificate

`POST /v1/domains/{domain}/ssl/renew`

Reissue the free managed (Let's Encrypt-style) certificate for the domain.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |

## DNS

### Create a DNS record

`POST /v1/domains/{domain}/records`

Create a DNS record. shadw's authoritative DNS server answers queries for the domain from these records.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | "A" \| "AAAA" \| "CNAME" \| "TXT" \| "MX" \| "NS" | yes | Record type. |
| `name` | string | yes | Subdomain (e.g. "www") or "@" for the apex. |
| `value` | string | yes | Record value (IP, hostname, text…). |
| `ttl` | number | no | Time-to-live in seconds (default 3600). |
| `priority` | number | no | Priority (MX records). |

### Update a DNS record

`PUT /v1/domains/{domain}/records/{id}`

Edit an existing DNS record (system-managed records are immutable).

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |
| `id` | string | yes | The record id. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | yes | Record type. |
| `name` | string | yes | Subdomain or @ for the apex. |
| `value` | string | yes | Record value. |
| `ttl` | number | no | Time-to-live in seconds. |

### Delete a DNS record

`DELETE /v1/domains/{domain}/records/{id}`

Delete a DNS record.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |
| `id` | string | yes | The record id. |

### Import DNS records

`POST /v1/domains/{domain}/import`

Bulk-import records (DNS migration) from a list and/or a pasted BIND zone file. Idempotent — exact duplicates are skipped.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `records` | DnsRecord[] | no | Structured records to import. |
| `zone` | string | no | Raw BIND-style zone text to parse and import. |

### Scan existing DNS

`GET /v1/domains/{domain}/scan`

Detect a domain's CURRENT public DNS records (via DNS-over-HTTPS) so they can be migrated into the console with one click. Records are returned, not added.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `domain` | string | yes | The domain name. |

## Webhooks

### List webhooks

`GET /v1/webhooks`

List outbound webhooks for the active team.

### List webhook events

`GET /v1/webhooks/events`

List the event types a webhook can subscribe to.

### Inbound Git webhook

`POST /v1/git/webhook`

Inbound GitHub webhook. A push to the production branch deploys to production; any other branch or a pull request builds a preview.

### Delete a webhook

`DELETE /v1/webhooks/{id}`

Delete an outbound webhook.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | The webhook id. |

## Teams

### List teams

`GET /v1/teams`

List the teams you belong to.

### Get a team

`GET /v1/teams/{slug}`

Get a team's details, members and plan.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | string | yes | The team slug. |

### Add a team member

`POST /v1/teams/{slug}/members`

Invite a member to a team.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | string | yes | The team slug. |

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string | yes | The member's email. |
| `role` | "owner" \| "member" | no | Role to assign (default member). |

### Remove a team member

`DELETE /v1/teams/{slug}/members/{email}`

Remove a member from a team.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | string | yes | The team slug. |
| `email` | string | yes | The member's email. |

## Tokens & API Keys

### Create an API key

`POST /v1/apikeys`

Create a long-lived platform API key (hive_…) bound to the active team. The plaintext token is returned exactly once — only its SHA-256 hash is stored. Present it as `Authorization: Bearer hive_…` to scope requests to the key's team.

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | yes | A label for the key (e.g. "ci"). |
| `role` | "owner" \| "member" | no | Role bound to the key (default "member"). |

### List API keys

`GET /v1/apikeys`

List the API keys for the active team. Only the display prefix is returned — the full token is shown once at creation and never stored.

### Revoke an API key

`DELETE /v1/apikeys/{id}`

Revoke an API key. Requests presenting the revoked token stop resolving immediately.

Path parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | The API key id. |

### Mint a token

`POST /v1/token`

Mint a short-lived (8 h) JWT bearer token scoped to a team + role. Requires HIVE_JWT_SECRET to be configured on the node (returns 400 otherwise). When JWT auth is enforced, mutating requests must present a JWT.

Body:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `sub` | string | no | Subject / user id embedded in the token (default "user"). |
| `tenant` | string | no | Team slug the token is scoped to (default "default"). |
| `role` | "owner" \| "member" \| "service" | no | Role embedded in the token (default "owner"). |

## Observability

### Get the overview

`GET /v1/overview`

Platform overview: deployments, regions, request counters and WAF status.

### Get logs

`GET /v1/logs`

Recent request + control-plane events for the active team.

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | number | no | Max events to return (default 100). |

### Get cluster resources

`GET /v1/resources`

Live cluster resource totals (CPU, memory, disk) across the mesh and this node's usage.

## shadw CLI commands

Every request sends `Authorization: Bearer <key>`. Configure with `shadw auth` (saves `~/.shadw/config.json`) or the environment: `SHADW_API_URL`, `SHADW_TOKEN`, `SHADW_TEAM`.

| Command | Purpose |
| --- | --- |
| `shadw auth` | Authenticate the CLI with your API key (saves ~/.shadw/config.json). |
| `shadw deploy` | Deploy a Git repository (clone → build → deploy). |
| `shadw build` | Inspect a build (status + streamed logs). |
| `shadw deployments` | Deployments — list, promote (rollback), delete, inspect. |
| `shadw projects` | Projects — settings, env vars, redeploy, domains, delete. |
| `shadw domains` | Domains & DNS — records, migration (scan/import), nameservers, SSL. |
| `shadw webhooks` | Outbound webhooks. |
| `shadw teams` | Teams & members. |
| `shadw keys` | API keys. |
| `shadw databases` | Databases. |
| `shadw cron` | Cron jobs. |
| `shadw workflows` | Workflows. |
| `shadw observability` | Observability — overview, logs, resources, metrics, regions, nodes. |
| `shadw api` | Generic API passthrough for any endpoint (escape hatch). |
