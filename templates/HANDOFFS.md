# Structured Handoff Contract

Agent-to-agent handoff must preserve enough information for the next agent to continue without relying on conversation history.

## Required fields

```yaml
kind: ImplementationResult | ReviewResult | VerifierResult
status: completed | partial | blocked
scope: <what was actually handled>
evidence:
  - <test/build/CI/artifact evidence>
risks:
  - <known risk or unresolved item>
next_action: <recommended next step>
```

## Semantics

- `completed`: the handoff's own scoped responsibility is complete.
- `partial`: useful work exists but the scoped responsibility is not complete.
- `blocked`: progress requires an unresolved dependency or decision.
- Missing verification is not equivalent to passing verification.
- Downstream agents must independently inspect mutable repository, PR, CI, review, and environment state before relying on it.
