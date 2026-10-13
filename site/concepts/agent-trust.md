# Identity and agent trust

The **Autheo Agent Environment** is the reference trust layer for AI agents: who an agent is, what it is allowed to do, and a tamper-evident record of what it was allowed to do. It gives every agent, person and environment a decentralized identifier (DID), lets authority be delegated in narrowing chains, and records signed, hash-linked receipts that anyone can verify offline.

Source: [SolutionsAsService/autheo-agent-environment](https://github.com/SolutionsAsService/autheo-agent-environment) version 0.3.0, commit `442b9e5` (2026-10-12), MIT licence. An older 0.1 copy is at [autheo-os/autheo-agent-environment](https://github.com/autheo-os/autheo-agent-environment).

::: warning Local reference prototype
This is a tested **local simulation**, not a production identity authority, wallet, sandbox, payment processor or agent-migration platform. Budgets are DEMO units, and **no action is executed, even when policy says allow**. Not available yet: on-chain anchoring, guaranteed revocation freshness (keep validity short), live-tested did:web, and encrypted key storage (demo DID keys are plain local files).
:::

## Concepts

| Concept | What it is |
| --- | --- |
| **DID** | A `did:key` identifier (Ed25519) created offline, with no registry or server. Agents, principals and environments each have one. |
| **Passport** | A signed statement binding an agent id, its owner and its public key (v1 model). |
| **Mandate / delegation** | Authority to act: environments, scopes, resources, tools, per-action and total budgets, an escalation threshold, validity and maximum depth. In v2 it is a W3C Verifiable Credential 2.0 (`AutheoDelegation`) signed with Data Integrity `eddsa-jcs-2022`. |
| **Delegation chain** | Up to 10 links from a root DID the verifier pins (for example human → agent → sub-agent). Each link can only **narrow** authority; widening is refused when issuing and rejected when verifying. |
| **Invocation** | An agent-signed request to perform one action under a chain. |
| **Decision** | The policy engine's result: `allow` (reserves simulated budget), `escalate` (needs human review; there is no agent-callable override) or `block` (consumes nothing). Every check is explained. |
| **Receipt ledger** | Per-environment SQLite ledger of signed, hash-chained receipts; tampering is detected by `ledger verify`. |
| **Revocation** | A signed record from an issuer, ancestor or subject that anyone can relay; verifiers reject chains containing revoked links. |
| **Checkpoint** | A signed export that hands a task's state to another environment. It carries **no** funds, private keys, environment variables or execution authority. |

## Try it

Python 3.11+.

```bash
git clone https://github.com/SolutionsAsService/autheo-agent-environment.git
cd autheo-agent-environment
python -m venv .venv && . .venv/bin/activate
python -m pip install -e '.[dev]'
python -m autheo_agent_environment.demo --output demo-output   # no network calls
python -m autheo_agent_environment.webapp                       # browser walkthrough on http://127.0.0.1:8765/
```

The demo creates ephemeral keys, issues a passport and a 100-DEMO-unit mandate, shows allow → escalate → block, writes signed receipts, exports a checkpoint to a second environment, and exports a 120-second read-only summary for the [Autheo MCP server](../mcp/index.md).

## Delegate authority between DIDs (v2)

```bash
D="python -m autheo_agent_environment did"
$D create --out human.json        # private key stays in the file (mode 0600)
$D create --out agent.json
$D create --out sub.json
$D delegate --key human.json --to did:key:<agent> --environment 'env:*' --scope compute.simulate \
   --resource 'listing:*' --per-action 80 --total 100 --threshold 50 --depth 1 --out chain1.json
$D delegate --key agent.json --to did:key:<sub> --parent chain1.json --environment env:research \
   --scope compute.simulate --resource listing:demo-01 --per-action 30 --total 50 --threshold 20 \
   --out chain2.json               # can only narrow
$D invoke --key sub.json --chain chain2.json --environment env:research \
   --action compute.simulate --resource listing:demo-01 --amount 20 --out inv.json
$D verify chain inv.json --root did:key:<human>          # offline: no state, no network
$D revoke --key agent.json --chain chain2.json --out rev.json && $D record-revocation rev.json
```

To record a decision in a local environment and get an offline-verifiable bundle:

```bash
$D trust --environment env:research --root did:key:<human>
$D evaluate --invocation inv.json --bundle-out bundle.json
python -m autheo_agent_environment.verifier bundle bundle.json --root did:key:<human>
```

Bundles also verify in a browser or Node with the dependency-free JavaScript verifier `interop/js/autheo-did.mjs`.

## Run it as a local trust service

Agent runtimes (for example [JARVIS](./aos-stack.md) and Paperclip) can call a persistent local service:

```bash
A="python -m autheo_agent_environment --state-dir .autheo-state"
$A init                       # dev issuer key, API token, policy.yaml, ledgers
$A identity issue --agent-id agent:jarvis-1 --owner-id human:operator \
   --environment env:research --public-key-file agent-public.pem
$A mandate grant --agent-id agent:jarvis-1 --environment env:research \
   --scope tool.invoke --resource repo:jarvis --tool git.status --per-action 50 --total 100 --threshold 40
$A evaluate --request-token-file request.jwt   # decision + explanation + receipt
$A ledger verify --environment env:research    # exit 1 on tampering
$A serve                                       # loopback API on 127.0.0.1:8780 (bearer token)
```

Policies are declarative (`autheo.policy/v1`, YAML or JSON): scope/tool/resource allow and deny globs, windowed and lifetime budgets, rate limits, time windows and escalation rules. The repository's `docs/API-AND-CLI.md`, `docs/openapi.json` (OpenAPI 3.1), `docs/POLICY.md`, `docs/SPEC-DID.md`, `docs/SPEC-SIGNATURES.md` and `docs/THREAT-MODEL.md` are the detailed references.

## How it connects to the rest of Autheo

- **Autheo MCP:** five optional read-only tools and `autheo://agent-trust` verify the environment's short-lived signed summary with an operator-pinned key. MCP never issues mandates or approves escalations.
- **JARVIS:** an off-by-default adapter turns JARVIS governance outcomes into signed v1 receipts (`JARVIS_AUTHEO_ENABLED=1`).
- **DevHub (Layer 0):** `docs/DEV-PORTAL-LAYER0.md` defines the planned integration boundary; nothing in DevHub calls the trust service yet.
