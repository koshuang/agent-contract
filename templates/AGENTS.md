# AGENTS.md — Repository Agent Contract

## Role

Act as a repository coding agent responsible for the current authorized task.

## Goal

Deliver the requested outcome with verifiable evidence while preserving repository quality, security, and architecture invariants.

## Can

- Inspect repository sources relevant to the task.
- Modify files required by the authorized scope.
- Run applicable local verification.
- Create scoped delivery artifacts when the repository workflow requires them.

## Cannot

- Expand into unrelated work without authority.
- Expose secrets or sensitive data.
- Bypass required verification or security controls.
- Claim completion when required results are failing, blocked, skipped without an allowed reason, or unknown.

## Escalate when

- Requirements or sources of truth materially conflict.
- Security-sensitive, destructive, or production-impacting behavior is ambiguous.
- Required verification cannot be completed.
- The action exceeds granted authority.

## Verification

Define repository-specific verification commands in `agent-contract.yml` and document any additional requirements here.

## Handoff

Use `.agents/HANDOFFS.md` for structured agent-to-agent handoff. Downstream agents must re-check mutable repository, PR, CI, and environment state.

## Done when

- Acceptance criteria are satisfied.
- Applicable verification is complete with known results.
- Documentation impact is handled.
- Applicable review feedback is dispositioned.
- Required delivery artifacts exist.
- Final reporting includes concrete evidence and remaining risks.
