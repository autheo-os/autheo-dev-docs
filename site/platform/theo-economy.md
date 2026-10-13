# The THEO economy

THEO is the unit everything on the [platform map](./index.md) is priced and settled in: DevHub plans, metered usage, marketplace capacity and (planned) app-ecosystem purchases. This page explains the loop and the settlement mechanics that exist in code. For the display price feed and where THEO trades, see [THEO price feed and markets](../concepts/theo.md). Nothing here is investment information.

## The loop

1. **Developers pay THEO** for DevHub plans and usage ([developer usage](./developer-usage.md)).
2. **Buyers pay THEO** for marketplace compute and storage orders.
3. **Providers earn THEO** from those orders through on-chain settlement, minus the platform fee.
4. **Publishers earn THEO** when others deploy their apps and agents (**planned**, see [app ecosystem](./app-ecosystem.md)).
5. **Validators** secure the Autheo L1 that records the settlements ([L1 networks](./l1-networks.md)).

## Units

| Item | Value | Source |
| --- | --- | --- |
| Native denomination on the L1 | `aauth` | [network config](../reference/networks.md) |
| Display conversion | 1 THEO = 10^18 aauth | [network config](../reference/networks.md) |
| THEO ERC-20 decimals (settlement profiles) | 18 | DevHub `marketplace.rs` |
| DevHub catalog amounts | hundredths of THEO | DevHub `checkout_theo_atomic` |

Marketplace and MCP amounts are handled as exact decimal strings, never floating point.

## Marketplace settlement

Source: [`crates/hive-cloud/src/marketplace.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/marketplace.rs) and [`docs/marketplace-settlement-profiles.md`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/docs/marketplace-settlement-profiles.md).

There are two settlement profiles, deliberately separated so test configuration can never repoint production:

| Profile | Network | Status |
| --- | --- | --- |
| `base-mainnet-v1` | Base mainnet (chain 8453), THEO ERC-20 `0xebe516a20238f79dc20b07ead6768e08891ed309` | **Historical only**: existing payments still verify; no new payment intents |
| `autheo-testnet-v1` | Autheo testnet (chain 785 / `0x311`) | Available only when an operator sets this exact profile and supplies audited contract addresses |

The testnet profile is fixed: RPC `https://testnet-rpc1.autheo.com`, explorer `https://testnet-explorer.autheo.com`, fee **500 bps**, **2** confirmations. Before it creates any intent, DevHub proves the RPC really is chain 785, that the THEO token and settlement contract addresses contain code, and that the token's `symbol()` is exactly `THEO`. An explicit audited flag and a configuration reference are also required; contract existence alone never implies approval.

### One transaction, three recipients

Payment goes through **MarketplaceAtomicFeeSplit V2**, which splits the gross amount atomically and emits:

```text
Settlement(bytes32 settlementKey, bytes32 orderReference, address payer, address token,
           address providerRecipient, uint256 grossAmount, uint256 providerAmount,
           address feeRecipient, uint256 feeAmount, uint256 feeBps)
```

DevHub derives the expected settlement key from the order (Solidity `abi.encode`, not packed), computes the event topic at runtime, and only accepts a receipt that matches the snapshotted profile, order, payer, provider and amounts after the confirmation depth. Every payment intent snapshots the complete profile, so later configuration changes cannot reinterpret an old payment.

## DevHub plan checkout

Plan and credit payments are a plain ERC-20 transfer of the exact THEO amount to an operator-configured treasury, verified on chain ([developer usage](./developer-usage.md#paying-in-theo)). Which chain that is depends on operator configuration; the code refuses to run checkout if chain, token, treasury, decimals or confirmations are missing or unsafe.

## Mainnet

The Autheo L1 mainnet configuration is published (`autheo_2127-1`), but no DevHub or Marketplace settlement profile targets it yet. **Mainnet settlement is planned.** Until then, treat testnet settlement as the integration target and do not send mainnet funds based on these docs.

## Next

[L1 testnet and mainnet](./l1-networks.md) · [THEO price feed and markets](../concepts/theo.md)
