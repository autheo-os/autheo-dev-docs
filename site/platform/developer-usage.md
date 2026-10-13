# Developer usage and billing

"Developer usage" is the arrow between the marketplace and the app ecosystem in the [platform map](./index.md): what your projects consume, how it is measured, and how it becomes a THEO charge. Source: [`crates/hive-cloud/src/billing.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/billing.rs) and the live [pricing page](https://dev.autheo.com/pricing) (both checked 2026-10-12).

## Plans

The public pricing page denominates plans in THEO and says USD values are display-only.

| Plan | Price | Highlights (pricing page) | Enforced quotas (source) |
| --- | --- | --- | --- |
| Hobby | 0 THEO, forever | 1 concurrent build, preview deploys, HTTPS, 100 GB bandwidth | 250 projects, 3 members, 3 running sandboxes, 1 GiB drive, no overage |
| Pro | 20 THEO / month | Unlimited concurrent builds, domains, roles, build cache, cron and workflows | 1,000 projects, 25 members, 10 running sandboxes, 25 GiB drive, pay-as-you-go overage |
| Enterprise | 1,000 THEO / month | 1,000 THEO of included compute, self-hosted nodes, data residency and leases, SSO, audit logs, SLA | Unlimited projects and members, overage |

## What is metered

The rate card is the single source of truth for metered pricing; the dashboard reads it and the meter loop charges with it.

| Dimension | Unit | Rate card value | Notes |
| --- | --- | --- | --- |
| Active CPU | CPU-hour (non-idle only) | 12.8 | Idle time is free ("Active-CPU pricing") |
| Memory | GB-hour provisioned | 1.06 | |
| Edge requests | per million | 200 | |
| WAF-blocked requests | per million | 60 | |
| GPU | GPU-hour, wall time | 60 | T4 class; a GPU is held for the instance's whole life |
| Browser-node requests | per million | 0 | Counted separately, deliberately unbilled today |

::: warning Units
Rate-card values are hundredths of the billing unit. Code comments still express them in USD cents, while plans are sold in THEO and THEO checkout converts catalog amounts as hundredths of THEO. Treat the dashboard's usage page as authoritative for what you are charged.
:::

Usage is accumulated per tenant from live metrics, charged as deltas, and every balance change goes to an append-only ledger and the audit log.

## Paying in THEO

DevHub's THEO checkout ([`ui/lib/theo-wallet.ts`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/lib/theo-wallet.ts), `theo_network` and `verify_theo_settlement` in [`admin.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/admin.rs)):

1. You connect MetaMask, Coinbase Wallet or Keplr (EVM mode). The provider object never leaves the page.
2. DevHub shows the operator-configured network: chain ID, RPC, explorer, THEO token address, treasury address, decimals and required confirmations. If any value is missing or unsafe, checkout is disabled instead of guessing.
3. You send an ERC-20 transfer of the **exact** THEO amount to the treasury.
4. DevHub verifies the transaction on chain: right chain ID, right token contract, recipient is the treasury, amount matches exactly, and the required confirmations have passed.

DevHub never holds a wallet secret and cannot sign a payment for you. The THEO/USD price shown beside amounts comes from a [display-only feed](../concepts/theo.md) and is never used to compute what you owe.

## From usage to providers

When a project runs on marketplace capacity, the order is settled separately through the marketplace's fee-split contract, so the provider is paid directly ([THEO economy](./theo-economy.md)). Per-request usage ingestion from providers into marketplace settlement is **planned**; today an order is a fixed allocation, not a metered stream.

## Next

[THEO economy](./theo-economy.md) · [App ecosystem](./app-ecosystem.md)
