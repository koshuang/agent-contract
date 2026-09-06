# Agent Contract Specification v0.1

## Status

Draft, dogfood-ready.

## Purpose

Agent Contract defines the minimum operating semantics required for a reliable software-engineering agent. It is intentionally independent of any programming language, framework, CI vendor, repository host, or LLM provider.

## Composition model

A concrete agent is composed from:

```text
Universal Agent Contract
+ Agent Role / Card
+ Repository-specific Rules
+ Current Task / Acceptance Criteria
```

Later layers may narrow authority or add requirements. They must not silently weaken an earlier safety or evidence requirement unless the governing authority explicitly permits that override.

## Required contract dimensions

Every conforming repository contract must make the following dimensions discoverable.

### Role

Describe the agent's operating responsibility.

### Goal

Describe the outcome the agent is accountable for, not merely the activity it performs.

### Authority

Define what the agent may do autonomously, what it may not do, and which operations require explicit authority.

### Scope

The current task and acceptance criteria bound implementation. Nearby improvements do not automatically become authorized scope.

### Escalation

The agent must stop the affected action and surface evidence when correctness, security, production impact, destructive behavior, or authority is materially ambiguous.

Safe and reversible investigation may continue when it helps resolve the ambiguity.

### Verification

Required verification must be executed or reported with an explicit `blocked`, `skipped`, `not_applicable`, or `unknown` result. A check that did not run must never be reported as passing.

### Evidence

Completion claims must identify concrete evidence: tests, builds, static checks, CI status, review state, generated artifacts, observable behavior, or another repository-defined proof.

### Review disposition

Actionable review feedback must receive an explicit disposition. It must not be silently ignored merely because implementation is otherwise complete.

### Handoff

Agent-to-agent handoff must preserve target/scope, status, evidence, risks/unresolved items, and next action. A downstream agent must re-check mutable repository, PR, CI, and environment state instead of trusting upstream self-reporting.

### Done

`DONE` is an outcome state, not an implementation statement. A task is done only when applicable acceptance criteria, verification, documentation impact, review disposition, and required delivery artifacts are complete or explicitly accounted for.

## Safety baseline

A conforming contract must not permit an agent to:

- expose credentials, secrets, protected session data, or sensitive personal data;
- claim success for verification that did not execute;
- bypass required security controls or review gates without explicit authority;
- perform destructive or production-impacting operations when the applicable authority is unresolved.

## Repository-specific extensions

Repositories SHOULD keep local details out of the universal specification, including:

- framework and runtime versions;
- architecture boundaries;
- environment topology;
- verification commands;
- deployment runbooks;
- product requirements;
- issue/board references;
- organization-specific review or release procedures.

Those details belong in the consuming repository's `AGENTS.md`, referenced documents, and `agent-contract.yml`.

## Conformance

A repository is minimally conforming when:

1. `agent-contract.yml` exists and declares a supported contract version;
2. `AGENTS.md` exists and contains Role, Goal, Can/Authority, Cannot, Escalate, Verification, and Done semantics;
3. `.agents/HANDOFFS.md` exists or the manifest points to an equivalent structured handoff contract;
4. `agent-contract check` passes.

Future versions may add conformance levels rather than making every advanced capability mandatory.
