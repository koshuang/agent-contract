# `agent-contract.yml` Manifest v0.1

The manifest is the machine-readable companion to `AGENTS.md`.

## Example

```yaml
version: 1
contract:
  spec: "0.1"
  inherits: shared
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

## Shared inheritance

A repository may set `contract.inherits: shared` when its local `AGENTS.md` intentionally contains only repository-specific extensions, stricter overrides, routing, and verification details while Role / Goal / Can / Cannot / Escalate / Done semantics are inherited from the shared Agent Contract.

This is an explicit opt-in. Without `contract.inherits: shared`, `check` continues to require the full shared section set in `AGENTS.md`.

Thin consumers are still required to declare a local `Verification` section. The inheritance flag must not be used to bypass repository-specific quality or safety declarations.

## Recommended fields

- `verification.commands`: repository-defined commands used to prove implementation quality.
- `review.disposition_required`: whether actionable review feedback requires explicit disposition.
- `handoff.path`: canonical structured handoff document.
- `security.destructive_operations`: policy label for destructive operations.

## Migration guidance

Existing repositories that currently copy the full shared contract may continue unchanged. To migrate to a thin consumer:

1. classify shared versus repository-specific rules;
2. keep stricter repository safety, architecture, verification, routing, and coordination rules in local `AGENTS.md`;
3. add `contract.inherits: shared` to the manifest;
4. retain an explicit local `Verification` section;
5. run `agent-contract check` before removing duplicated shared prose.

## Design rule

The manifest describes policy configuration. It does not replace the human-readable repository entrypoint. `AGENTS.md` remains the primary file agents read on repository entry; thin consumers use it to route to the shared contract plus local extensions, while the manifest enables deterministic tooling and CI.
