# MCP tool reference

**Generated from code — do not edit by hand.** This page is produced by `scripts/gen-mcp-reference.mjs` from [autheo-os/autheo-MCP](https://github.com/autheo-os/autheo-MCP) commit [`663416577abb`](https://github.com/autheo-os/autheo-MCP/tree/663416577abbd4ef5b7bb2d85448e70bb1a828f5) (package version `0.3.0a1`, committed 2026-10-12) using FastMCP tools/list and resources/list introspection of autheo_mcp.server.

The registered surface at that commit is **44 tools** and **5 resources**. 44 of 44 tools declare the MCP `readOnlyHint` annotation. A tool being registered does not mean a live Autheo service is reachable: every tool calls only the endpoints you configure (see [MCP server](./index.md)).

::: warning Source-backed, not live-tested
The MCP README states the implementation was verified with local contract fixtures and MCP stdio sessions, "not proof of access to a live Autheo installation". Descriptions below are the docstrings registered in code.
:::

## Summary

| Group | Tools |
| --- | --- |
| [Server and setup](#server-and-setup) | 2 |
| [Chain reads (CometBFT / Cosmos REST)](#chain-reads-cometbft-cosmos-rest) | 6 |
| [THEO display price](#theo-display-price) | 3 |
| [Marketplace](#marketplace) | 11 |
| [DevHub (Hive admin API)](#devhub-hive-admin-api) | 11 |
| [Legacy DevHub node inspection](#legacy-devhub-node-inspection) | 6 |
| [Agent trust inspection](#agent-trust-inspection) | 5 |

## Server and setup

| Tool | Summary |
| --- | --- |
| [`autheo_get_integration_guide`](#autheo_get_integration_guide) | Local integration map and prerequisites; does not claim a live backend connection. |
| [`autheo_get_server_info`](#autheo_get_server_info) | Return information about the Autheo MCP server. |

### autheo_get_integration_guide

Local integration map and prerequisites; does not claim a live backend connection.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_server_info

Return information about the Autheo MCP server.

This is a local MCP capability check and does not query the blockchain.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

## Chain reads (CometBFT / Cosmos REST)

| Tool | Summary |
| --- | --- |
| [`autheo_get_account`](#autheo_get_account) | Retrieve basic information about an Autheo account. |
| [`autheo_get_balance`](#autheo_get_balance) | Retrieve the native THEO balance for an Autheo address. |
| [`autheo_get_block`](#autheo_get_block) | Retrieve an Autheo block by height. |
| [`autheo_get_latest_block`](#autheo_get_latest_block) | Get the latest Autheo blockchain block. |
| [`autheo_get_network_status`](#autheo_get_network_status) | Get the current status of the Autheo network. |
| [`autheo_get_transaction`](#autheo_get_transaction) | Retrieve an Autheo transaction by transaction hash. |

### autheo_get_account

Retrieve basic information about an Autheo account.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `address` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_balance

Retrieve the native THEO balance for an Autheo address.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `address` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_block

Retrieve an Autheo block by height.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `height` | integer | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_latest_block

Get the latest Autheo blockchain block.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_network_status

Get the current status of the Autheo network.

Queries the configured CometBFT RPC endpoint and DevHub health endpoint.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_transaction

Retrieve an Autheo transaction by transaction hash.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `tx_hash` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

## THEO display price

| Tool | Summary |
| --- | --- |
| [`autheo_convert_theo_to_usd`](#autheo_convert_theo_to_usd) | Convert a THEO amount into its USD reference value using the Autheo oracle. |
| [`autheo_convert_usd_to_theo`](#autheo_convert_usd_to_theo) | Convert a USD reference amount into THEO using the Autheo oracle. |
| [`autheo_get_theo_price`](#autheo_get_theo_price) | Return display-only THEO/USD data with freshness status; not settlement authority. |

### autheo_convert_theo_to_usd

Convert a THEO amount into its USD reference value using the
Autheo oracle.

This does not execute a trade.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `amount_theo` | number | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_convert_usd_to_theo

Convert a USD reference amount into THEO using the Autheo oracle.

This is an informational conversion and does not execute a trade.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `amount_usd` | number | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_theo_price

Return display-only THEO/USD data with freshness status; not settlement authority.

This tool is intentionally separated from marketplace pricing.
Marketplace prices should be denominated in THEO while this oracle
provides the external USD reference value.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

## Marketplace

| Tool | Summary |
| --- | --- |
| [`autheo_get_order`](#autheo_get_order) | Retrieve an Autheo marketplace order. |
| [`autheo_marketplace_categories`](#autheo_marketplace_categories) | Return the major Autheo marketplace resource categories. |
| [`autheo_marketplace_estimate_listing`](#autheo_marketplace_estimate_listing) | Local exact-decimal estimate from current listing price; NOT an authoritative checkout quote/reservation. |
| [`autheo_marketplace_get_capacity`](#autheo_marketplace_get_capacity) | Read public capacity projection; does not expose the private mesh advertisement API. |
| [`autheo_marketplace_get_listing`](#autheo_marketplace_get_listing) | Get live listing detail, constraints and canonical decimal-string price. |
| [`autheo_marketplace_get_placement_policy`](#autheo_marketplace_get_placement_policy) | Read an order's placement constraints; never schedule or mutate the policy. |
| [`autheo_marketplace_get_settlement_status`](#autheo_marketplace_get_settlement_status) | Read recorded settlement status. Does NOT verify payments or trigger allocation. |
| [`autheo_marketplace_list_l0_deployments`](#autheo_marketplace_list_l0_deployments) | Private HMAC/mTLS service read of short-lived L0 advertisements. Not public listing inventory. |
| [`autheo_marketplace_list_listings`](#autheo_marketplace_list_listings) | Browse purchasable Marketplace listings; preserves exact THEO strings and upstream page metadata. |
| [`autheo_marketplace_list_orders`](#autheo_marketplace_list_orders) | List orders for the configured Clerk session's buyer tenant (upstream limit 100). |
| [`autheo_marketplace_provider_view`](#autheo_marketplace_provider_view) | Read own provider profile, listings, node_bindings, orders, or infrastructure_rewards; Clerk role/tenant enforced upstream. |

### autheo_get_order

Retrieve an Autheo marketplace order.

Reads the authenticated Marketplace order. A marketplace order is not a DevHub deployment.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `order_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_categories

Return the major Autheo marketplace resource categories.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_estimate_listing

Local exact-decimal estimate from current listing price; NOT an authoritative checkout quote/reservation.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `listing_id` | string | yes | — |
| `quantity` | integer | no | `1` |
| `duration` | integer | no | `1` |
| `duration_unit` | string | no | `"hour"` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_get_capacity

Read public capacity projection; does not expose the private mesh advertisement API.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_get_listing

Get live listing detail, constraints and canonical decimal-string price.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `listing_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_get_placement_policy

Read an order's placement constraints; never schedule or mutate the policy.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `order_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_get_settlement_status

Read recorded settlement status. Does NOT verify payments or trigger allocation.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `order_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_list_l0_deployments

Private HMAC/mTLS service read of short-lived L0 advertisements. Not public listing inventory.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_list_listings

Browse purchasable Marketplace listings; preserves exact THEO strings and upstream page metadata.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `resource_type` | string or null | no | `null` |
| `region` | string or null | no | `null` |
| `limit` | integer | no | `25` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_list_orders

List orders for the configured Clerk session's buyer tenant (upstream limit 100).

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_marketplace_provider_view

Read own provider profile, listings, node_bindings, orders, or infrastructure_rewards; Clerk role/tenant enforced upstream.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `view` | string | no | `"profile"` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

## DevHub (Hive admin API)

| Tool | Summary |
| --- | --- |
| [`autheo_devhub_get_build`](#autheo_devhub_get_build) | Read DevHub build state and evidence from the real /v1/builds/{id} route. |
| [`autheo_devhub_get_build_logs`](#autheo_devhub_get_build_logs) | Read the last 1–2000 build log lines; never executes a build. |
| [`autheo_devhub_get_deployment`](#autheo_devhub_get_deployment) | Find a deployment in the team-scoped /deployments response. |
| [`autheo_devhub_get_deployment_resources`](#autheo_devhub_get_deployment_resources) | Read actual deployment resources from DevHub. |
| [`autheo_devhub_get_job`](#autheo_devhub_get_job) | Retrieve an Autheo DevHub workload/job. |
| [`autheo_devhub_get_project`](#autheo_devhub_get_project) | Retrieve an Autheo DevHub project. |
| [`autheo_devhub_list_deployments`](#autheo_devhub_list_deployments) | Read deployments visible to the configured DevHub team. |
| [`autheo_devhub_list_nodes`](#autheo_devhub_list_nodes) | Read and normalize DevHub nodes; hardware totals do not imply available marketplace capacity. |
| [`autheo_devhub_list_projects`](#autheo_devhub_list_projects) | List project names derived from visible deployments; undeployed projects are not included. |
| [`autheo_devhub_search`](#autheo_devhub_search) | Search deployment-backed DevHub projects and deployments (not a complete project inventory). |
| [`autheo_devhub_status`](#autheo_devhub_status) | Read overview, cluster, mesh, security, or wallet metadata; process liveness is not mesh health. |

### autheo_devhub_get_build

Read DevHub build state and evidence from the real /v1/builds/{id} route.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `build_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_get_build_logs

Read the last 1–2000 build log lines; never executes a build.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `build_id` | string | yes | — |
| `tail` | integer | no | `200` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_get_deployment

Find a deployment in the team-scoped /deployments response.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `deployment_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_get_deployment_resources

Read actual deployment resources from DevHub.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `deployment_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_get_job

Retrieve an Autheo DevHub workload/job.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `job_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_get_project

Retrieve an Autheo DevHub project.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `project_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_list_deployments

Read deployments visible to the configured DevHub team.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_list_nodes

Read and normalize DevHub nodes; hardware totals do not imply available marketplace capacity.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_list_projects

List project names derived from visible deployments; undeployed projects are not included.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_search

Search deployment-backed DevHub projects and deployments (not a complete project inventory).

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `query` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_devhub_status

Read overview, cluster, mesh, security, or wallet metadata; process liveness is not mesh health.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `view` | string | no | `"overview"` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

## Legacy DevHub node inspection

| Tool | Summary |
| --- | --- |
| [`autheo_compute_quote`](#autheo_compute_quote) | Generate a simulated compute quote. |
| [`autheo_compute_search`](#autheo_compute_search) | Search reported DevHub hardware, NOT reservable marketplace listings. Use autheo_marketplace_list_listings for purchasable inventory. |
| [`autheo_get_provider`](#autheo_get_provider) | Retrieve information about an Autheo marketplace provider. |
| [`autheo_get_provider_reputation`](#autheo_get_provider_reputation) | Retrieve the reputation information for an Autheo provider. |
| [`autheo_storage_quote`](#autheo_storage_quote) | Generate a simulated storage quote. |
| [`autheo_storage_search`](#autheo_storage_search) | Search reported DevHub storage hardware, NOT reservable marketplace listings. |

### autheo_compute_quote

Generate a simulated compute quote.

This function MUST NOT create an order or move THEO.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `cpu` | integer | yes | — |
| `ram_gb` | integer | yes | — |
| `duration_hours` | number | yes | — |
| `storage_gb` | integer | no | `0` |
| `gpu` | string or null | no | `null` |
| `gpu_count` | integer | no | `0` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_compute_search

Search reported DevHub hardware, NOT reservable marketplace listings. Use autheo_marketplace_list_listings for purchasable inventory.

Prices are expressed in THEO. USD conversion should be performed
separately through the Autheo oracle.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `cpu` | integer | yes | — |
| `ram_gb` | integer | yes | — |
| `storage_gb` | integer | no | `0` |
| `gpu` | string or null | no | `null` |
| `gpu_count` | integer | no | `0` |
| `max_price_theo_hour` | number or null | no | `null` |
| `min_reputation` | number or null | no | `null` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_provider

Retrieve information about an Autheo marketplace provider.

Providers are represented by DevHub nodes in the L0 deployment.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `provider_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_get_provider_reputation

Retrieve the reputation information for an Autheo provider.

Currently sourced from DevHub node capacity metadata.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `provider_id` | string | yes | — |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_storage_quote

Generate a simulated storage quote.

This function MUST NOT create a storage contract or transfer THEO.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `storage_gb` | integer | yes | — |
| `duration_days` | integer | yes | — |
| `replication_factor` | integer | no | `1` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_storage_search

Search reported DevHub storage hardware, NOT reservable marketplace listings.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `storage_gb` | integer | yes | — |
| `duration_days` | integer | yes | — |
| `replication_factor` | integer | no | `1` |
| `max_price_theo_month` | number or null | no | `null` |
| `min_reputation` | number or null | no | `null` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

## Agent trust inspection

| Tool | Summary |
| --- | --- |
| [`autheo_agent_get_mandate`](#autheo_agent_get_mandate) | Inspect scoped mandate and DEMO budget summary; no real wallet funds or approvals. |
| [`autheo_agent_get_passport`](#autheo_agent_get_passport) | Read the configured agent's issuer-asserted identity, not a proof of legal ownership. |
| [`autheo_agent_list_receipts`](#autheo_agent_list_receipts) | Read up to 20 signed-snapshot receipt summaries; not an independent action/chain proof. |
| [`autheo_agent_trust_guide`](#autheo_agent_trust_guide) | Explain agent trust setup and boundaries. Does not issue identity, authority, or wallet access. |
| [`autheo_agent_trust_status`](#autheo_agent_trust_status) | Inspect a pinned-issuer signed snapshot and audit summary. Never grants execution authority. |

### autheo_agent_get_mandate

Inspect scoped mandate and DEMO budget summary; no real wallet funds or approvals.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_agent_get_passport

Read the configured agent's issuer-asserted identity, not a proof of legal ownership.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_agent_list_receipts

Read up to 20 signed-snapshot receipt summaries; not an independent action/chain proof.

| Argument | Type | Required | Default |
| --- | --- | --- | --- |
| `limit` | integer | no | `20` |

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_agent_trust_guide

Explain agent trust setup and boundaries. Does not issue identity, authority, or wallet access.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

### autheo_agent_trust_status

Inspect a pinned-issuer signed snapshot and audit summary. Never grants execution authority.

Arguments: none.

Annotations: `readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`.

## Resources

| URI | Description |
| --- | --- |
| `autheo://agent-trust` | Local documentation of the external agent environment's trust boundary. |
| `autheo://capabilities` | Describe the capabilities exposed by this MCP server. |
| `autheo://integrations` | Pinned integration contracts and setup boundaries. |
| `autheo://marketplace` | Description of the Autheo marketplace. |
| `autheo://network` | Basic Autheo network information. |

## Regenerate

~~~sh
node scripts/gen-mcp-reference.mjs --source ../autheo-MCP   # clean checkout at the commit to document
node scripts/gen-mcp-reference.mjs --check                   # CI: Markdown matches data/mcp-tools.json
npm run docs:build
~~~
