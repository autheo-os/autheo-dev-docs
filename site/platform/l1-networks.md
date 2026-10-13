# Autheo L1: testnet and mainnet

The Autheo L1 is the foundation of the [Autheo stack](./stack.md): every layer above it (marketplace, Layer 0 mesh, DevHub, app ecosystem) is priced in THEO and settles here. L0 does not run consensus; it sends payment and settlement facts to the L1 and keeps logs and bulk data off-chain. It is an EVM-capable Cosmos SDK chain (CometBFT consensus, Ethermint EVM; see [architecture](../concepts/architecture.md)). It has a **testnet**, which DevHub's marketplace settlement targets today, and a published **mainnet** configuration.

## Testnet (live-probed)

| Item | Value | Evidence |
| --- | --- | --- |
| Network name | Autheo Testnet | DevHub settlement profile `autheo-testnet-v1` |
| EVM chain ID | `785` (`0x311`) | DevHub [`marketplace.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/marketplace.rs); confirmed live |
| JSON-RPC | `https://testnet-rpc1.autheo.com` | Same; confirmed live |
| Explorer | `https://testnet-explorer.autheo.com` | Same; HTTP 200 |
| Currency symbol | THEO | Same |

**Probe, 2026-10-12 (America/Denver evening):** `eth_chainId` returned `0x311` (785) and `eth_blockNumber` returned `0x997810` (block 10,057,744). The explorer returned HTTP 200. A plain `GET` to the RPC returns 405, which is expected for a JSON-RPC endpoint. This shows the endpoint answered; it is not an uptime guarantee.

### Add testnet to a wallet

Use these values in MetaMask, Coinbase Wallet or Keplr (EVM mode): network name *Autheo Testnet*, RPC URL `https://testnet-rpc1.autheo.com`, chain ID `785`, currency symbol `THEO`, explorer `https://testnet-explorer.autheo.com`.

Check it yourself:

```sh
curl -s -X POST https://testnet-rpc1.autheo.com \
  -H 'content-type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
# expect {"jsonrpc":"2.0","id":1,"result":"0x311"}
```

The testnet THEO token and fee-split contract addresses are operator configuration and are not published in these docs. No faucet is documented here.

## Mainnet (configuration published)

| Item | Value |
| --- | --- |
| Cosmos chain ID | `autheo_2127-1` |
| Native denomination | `aauth` (1 THEO = 10^18 aauth) |
| Binary | `autheod` |
| Bech32 prefix | `autheo` |

Source and full table: [network reference](../reference/networks.md). The mainnet EVM chain ID, public RPC and explorer were **not** verified for this documentation; obtain them from an official, environment-specific source before connecting a wallet. Do not infer an EVM chain ID from the Cosmos chain ID.

## Which network should I use?

| You are… | Use |
| --- | --- |
| Building or testing marketplace settlement, THEO payments, contracts | **Testnet** |
| Running a validator or full node | The network your operator approved; start with [node preparation](../guides/node-operator.md) |
| Reading chain state for an app | Testnet for development; mainnet only with a verified endpoint ([integration preparation](../guides/integration.md)) |

## Next

[THEO economy](./theo-economy.md) · [Network reference](../reference/networks.md) · [API families](../reference/api.md)
