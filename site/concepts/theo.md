# THEO

THEO is the token Autheo uses to price Marketplace resources (compute, storage, bandwidth, hosting). This page covers only what developers can read today; it is not investment information.

## Display price feed

dev.autheo.com publishes a reference price at `https://dev.autheo.com/api/market-reference/theo`. On 2026-10-12 it returned JSON with these fields:

| Field | Meaning |
| --- | --- |
| `available` | Whether a price could be fetched |
| `price_usd` | Reference price in USD |
| `change_24h_pct` | 24-hour change, percent |
| `liquidity_usd` | Reported liquidity of the source pool |
| `source`, `source_url` | Where the price came from (that day: Dexscreener, Base / Hydrex pool) |
| `fetched_at_ms` | Retrieval time (not proof of a recent trade) |
| `stale` | True when the value is too old to use |
| `display_only` | Always true: for display, not for settlement or quotes |

The [Autheo MCP server](../mcp/index.md) reads this feed (or an operator-supplied feed) and refuses to convert amounts when the price is stale or unavailable. Marketplace amounts stay exact decimal strings.

## Where THEO trades

[autheo-os/theo-atlas](https://github.com/autheo-os/theo-atlas) (commit `0294acd`) is a local read-only market monitor. It covers MEXC THEO/USDT, the Hydrex THEO/USDC pool on Base, and Uniswap v3 THEO/USDG and THEO/NVDA pools on Robinhood Chain. Robinhood Chain pools are not a claim that the Robinhood brokerage lists THEO. It deliberately omits market cap and cross-chain FDV, and treats pool reserves as reported liquidity, not a guaranteed sell quote.

## Settlement

Settling DevHub or Marketplace usage in THEO on the Autheo chain is **design only** today; no component sends transactions.
