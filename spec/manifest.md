# `agent-contract.yml` Manifest v0.1

The manifest is the machine-readable companion to `AGENTS.md`.

## Example

```yaml
version: 1
contract:
  spec: "0.1"
verification:
  commands:
    - yarn lint
    - yarn typecheck
    - yarn test
review:
  disposition_required: true
handoff:
  path: .agents/HANDOFFS.md
security:
  destructive_operations: explicit-approval
```

## Required fields

- `version`: manifest schema version. v0.1 supports `1`.
- `contract.spec`: Agent Contract specification version.

## Recommended fields

- `verification.commands`: repository-defined commands used to prove implementation quality.
- `review.disposition_required`: whether actionable review feedback requires explicit disposition.
- `handoff.path`: canonical structured handoff document.
- `security.destructive_operations`: policy label for destructive operations.

## Design rule

The manifest describes policy configuration. It does not replace the human-readable repository contract. `AGENTS.md` remains the primary document agents should read; the manifest enables deterministic tooling and CI.
