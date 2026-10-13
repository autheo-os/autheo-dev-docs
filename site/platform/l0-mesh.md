# Layer 0 mesh

**Layer 0 (L0)** is the compute fabric between the Autheo L1 and DevHub: a peer-to-peer mesh of independent nodes that runs every DevHub deployment. DevHub is the developer surface; L0 is where the work actually executes. Source: [autheo-os/L0_devhub_deploy](https://github.com/autheo-os/L0_devhub_deploy) at `29abc9f` (the same repository holds DevHub and the mesh node).

For the original design discussion (admission, lifecycle, provider trust), see [L0 Mesh design](../components/mesh.md) and [Connectivity](../components/connectivity.md). This page documents what the code implements.

## Status

**Source-backed** and running behind dev.autheo.com. These docs did not operate a node or measure the fleet; public node counts and regions are not published here.

## The five fabrics

| Fabric | What it does | Implemented by |
| --- | --- | --- |
| **Network** | Encrypted peer-to-peer QUIC with cryptographic node identity, NAT hole-punching and relay fallback; nodes reachable by ID without public IPs | `hive-p2p` (iroh endpoint, relay + DNS discovery), `hive-wg` (ephemeral WireGuard-style tunnels), [`gossip.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/gossip.rs) (roster and leases over authenticated iroh, HTTP fallback) |
| **Distributed compute** | "Serverless servers": per-function pools of long-lived instances, in-function concurrency, reuse before provision, scale to zero | `fluid-compute`, `fluid-tunnel` (one multiplexed tunnel per instance), `hived` (control plane, microVM cells, warm pools; Firecracker on KVM) |
| **Compute** (nodes) | Where capacity comes from: platform nodes, self-hosted nodes (Enterprise), GPU nodes, and browser tabs donated via `/run-node` | `hive-cloud` node binary, [`gpu_pool.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/gpu_pool.rs), [`run-node-targets.ts`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/ui/lib/run-node-targets.ts) |
| **Data** | Platform state replicated across the mesh; local-first CRDT tables; project storage and databases | [`guardian.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/guardian.rs) (GuardianDB: iroh-docs + iroh-blobs, BLAKE3, Willow reconciliation), `hive-crsql` (cr-sqlite CRR tables, also in browser nodes) |
| **Identity and trust** | Node identity from iroh keys; peer trust gate on connections; single-owner leases for stateful containers | `hive-p2p`, [`lease.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/lease.rs) (rendezvous hashing + fenced epochs, no global Raft); `hive-zkauth` (anonymous membership proofs) is an **experiment, not wired in** |

## Request path

The public router, `fluid-gateway`, picks the deployment by `Host`, resolves the route to a static asset or a function, and either serves the file or leases a Fluid instance and proxies over that instance's tunnel. DNS answers by client proximity using EDNS Client Subnet ([`dns_geo.rs`](https://github.com/autheo-os/L0_devhub_deploy/blob/29abc9f68731963039a2fbfc3371f0237c93d39e/crates/hive-cloud/src/dns_geo.rs)), so users reach a nearby healthy node.

## Stateless vs stateful

- **Functions and static sites** are stateless: any node holding the deployment can serve; no coordination needed.
- **Stateful containers** (databases, game servers) get exactly one owner at a time. Nodes agree on the preferred owner by rendezvous hashing; a fenced lease epoch stops a partitioned old owner from split-brain; on owner death the next holder takes over with a higher epoch.

## How L0 connects to the layers around it

- **Up to DevHub:** DevHub's API and builds decide *what* runs; L0 decides *where* among eligible nodes and runs it. ([The Autheo stack](./stack.md))
- **Sideways to the marketplace:** a marketplace order's placement policy restricts which L0 nodes may run a workload. The Marketplace service never joins the mesh or sees node keys. ([Compute and storage marketplace](./compute-marketplace.md))
- **Down to the L1:** L0 does not run consensus. Payment and settlement facts go to the Autheo L1; logs, artifacts and bulk data stay off-chain. ([L1 testnet and mainnet](./l1-networks.md))

## Run a node

- **Locally, for development:** `npx @shadw/node` boots one real `hive-cloud` node in mock mode (package still uses the working name). ([Build with DevHub](./build.md#_1-ide-toolkit))
- **As a provider:** self-hosted nodes are an Enterprise feature today; read [provider preparation](../guides/provider-design.md). Public provider onboarding is **planned**.
- **From a browser:** sign in to dev.autheo.com and open `/run-node`.

L0 nodes are not L1 validators. To run a chain node, see [node preparation](../guides/node-operator.md).
