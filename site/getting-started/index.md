# Getting started

::: warning New here?
Read the [platform map](../platform/index.md) first. It shows the three Autheo surfaces (DevHub, app ecosystem, compute/storage marketplace), the THEO economy and the L1 testnet and mainnet, and links each to its section. The [developer journeys](../platform/journeys.md) give a step-by-step path for app developers, agent builders, providers, publishers and chain integrators.
:::

## 1. Identify your task

AUTHEO Chain integration, infrastructure operation, and proposed ecosystem services need different instructions. Begin with [architecture boundaries](../concepts/architecture.md), not an unversioned command copied from a planning document.

## 2. Choose a verified environment

Record the network name, exact chain identifier, trusted configuration revision, endpoint operator, software release, and date checked. The [network reference](../reference/networks.md) records published configuration; it is not a list of tested public endpoints.

Do not infer an Ethereum JSON-RPC chain ID from a Cosmos chain-ID string. Do not transfer funds to establish whether a guessed environment works.

## 3. Choose your next guide

| Goal | Next step | Required input |
| --- | --- | --- |
| Query or integrate with the chain | [Integration preparation](../guides/integration.md) | Operator-approved endpoint and API family |
| Run a full node or validator | [Node preparation](../guides/node-operator.md) | Approved release and network configuration |
| Deploy an app on Autheo DevHub | [Build with DevHub](../platform/build.md) | An account at dev.autheo.com |
| Test THEO payments or contracts | [L1 testnet and mainnet](../platform/l1-networks.md) | A wallet configured for testnet chain 785 |
| Understand L0, DevHub, Marketplace, Freddie | [Ecosystem concepts](../concepts/ecosystem.md) | Start with roles and flows; obtain release evidence before execution |
| Fix a docs problem | [Troubleshooting](../troubleshooting/index.md) | Page URL and non-sensitive error details |

## Before you run anything

Review scripts and their permissions. Keep seed phrases, private keys, access tokens, and personal data out of terminals shared with others and out of issue reports. Use a sandbox and non-production credentials for integration work. [Security boundaries](../concepts/security.md) explain the limits of this documentation.

## Understand the design before selecting a product

For application hosting, follow [DevHub](../components/devhub.md) → [Marketplace](../components/marketplace.md) → [Mesh](../components/mesh.md), with [connectivity](../components/connectivity.md) beneath execution and L1 alongside accounting. For delegated operations, add [Freddie](../components/freddie.md) only after defining authority and spending limits. This reading path is useful even before a supported deployment flow is established.
