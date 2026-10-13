# Glossary

| Term | Meaning in these docs |
| --- | --- |
| AUTHEO Chain / L1 | Chain application and its consensus-backed state; source includes EVM integration |
| L0 Mesh | Design vocabulary for off-chain coordination and compute execution |
| Cosmos chain ID | String identifying a Cosmos network configuration; not interchangeable with a JSON-RPC chain ID |
| EVM | Ethereum Virtual Machine execution environment; distinct from a general-purpose workload host |
| REST gateway | HTTP interface mapped to protobuf service methods |
| gRPC | Typed service interface defined by protobuf |
| Genesis | Initial chain state/configuration artifact that must match the intended network |
| THEO / aauth | Display unit and native denomination as published by the network source; see network reference |
| DevHub | Developer-facing project and deployment concept |
| Marketplace | Commercial coordination concept; not proof of a released payment contract |
| Freddie | Agent-assisted operations concept; delegated permissions require a separate contract |
| OpenEdge GitOps | Planned bridge from versioned application source to DevHub desired deployment state |
| Agentic OS | Umbrella name for developer interfaces and Freddie, not a separate operating-system kernel |
| Control plane | Intent, admission, scheduling, authorization and policy decisions |
| Data plane | Artifact/input movement, workload execution, service traffic and results |
| Fluid Compute | Proposed warm-runtime reuse; no guaranteed start time |
| Peer / endpoint identity | Identity used to address and authenticate a mesh participant; distinct from wallet authority |
| CRDT | Mergeable replicated-state model proposed for operational synchronization; not payment consensus |
| Attestation | Evidence about a specified platform/property, not universal proof of safe behavior |
| DaaS | Developer-as-a-Service: proposed application/support offerings, potentially bundled with hosting |
| Drain | Stop admitting new work while completing or safely recovering existing work |
| Admission | Decision that current policy and capacity permit a particular workload |
| Settlement | Verified accounting/payment outcome under a specified chain mechanism |
| Source-backed | Supported by a particular source revision, without claiming live deployment |
| Platform map | The three Autheo surfaces (DevHub, app ecosystem, compute/storage marketplace) inside the THEO economy on the L1; see [platform map](../platform/index.md) |
| Autheo Labs | The team behind DevHub, the first go-to-market surface |
| Autheo testnet | EVM chain ID 785 (`0x311`), RPC `testnet-rpc1.autheo.com`; target of the marketplace settlement profile |
| Placement policy | Marketplace order data that pins which approved nodes may run a deployment; DevHub never falls back to other nodes |
| Marketplace release | Immutable, publishable version of a DevHub project with declared capabilities; the unit of app distribution |
| AtomicFeeSplit V2 | Settlement contract that pays provider and fee recipient in one THEO transaction and emits a `Settlement` event |
| Workflow run | One execution of a durable DevHub workflow; steps, events and hooks are persisted and can be replayed |
| Browser node | A browser tab donated as a mesh node via `/run-node`; its requests are counted but not billed today |
| Active CPU | Billing unit that charges only non-idle CPU time |

See [architecture](../concepts/architecture.md), [networks](./networks.md), and [status](./status.md).
