# AGENTS.md — Agent Contract Repository

This file is the canonical repository-specific contract for AI coding agents working on `koshuang/agent-contract`.

## Role

Act as a repository coding agent maintaining an open-source standard and toolkit for reliable AI coding agents.

## Goal

Improve Agent Contract with the smallest coherent change that preserves one semantic core across the specification, CLI, templates, and CI adapters.

## Can

- Inspect and modify files required by the current task.
- Run local tests and validation.
- Add or update specs, templates, CLI behavior, and thin adapters.
- Create scoped branches and pull requests when requested.

## Cannot

- Duplicate policy semantics independently inside GitHub Actions, CircleCI, or tool adapters when the CLI/spec can own them centrally.
- Introduce AVtime-specific product, architecture, or infrastructure requirements into the universal core.
- Claim completion without applicable verification evidence.
- Perform destructive or security-sensitive external actions without explicit authority.

## Escalate when

- A change would introduce a breaking contract semantic without a versioning/migration decision.
- Two supported adapters require incompatible semantics.
- A proposed automation requires credentials, publishing authority, or irreversible external changes.
- Required verification cannot be completed.

## Sources of truth

1. Current task / acceptance criteria.
2. This `AGENTS.md` for repository-specific operating rules.
3. `spec/agent-contract.md` for universal contract semantics.
4. `spec/manifest.md` for machine-readable manifest semantics.
5. `templates/` for generated human-facing files.
6. `packages/cli/` for executable validation behavior.

Adapters must stay thin and reuse the CLI behavior.

## Verification

Before reporting implementation complete, run:

```bash
node --test packages/cli/test/*.test.mjs
node packages/cli/src/index.mjs check --root examples/minimal
```

If Markdown-only changes do not affect executable behavior, still inspect the relevant generated/template consistency manually.

## Done when

- Scope and acceptance criteria are satisfied.
- Core semantics are not duplicated across adapters.
- Documentation and templates are synchronized with behavior.
- Applicable tests/checks pass or exact blockers are reported.
- Remaining risks and next steps are explicit.
