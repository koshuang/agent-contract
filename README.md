# Agent Contract

**Executable operating standards for reliable AI coding agents.**

Agent Contract turns reusable agent-engineering practices into a versioned, installable, and CI-enforceable toolkit. It is designed so Claude Code, Codex, Gemini, Cursor, and future coding agents can follow the same operating model without every repository copying and slowly diverging its own prompt.

## Why

AI agents are good at implementation, but reliability depends on the contract around the implementation:

- What is the agent allowed to do?
- When must it escalate instead of guessing?
- What evidence is required before claiming `DONE`?
- How does one agent hand work to another without trusting conversation history?
- How are repository-specific rules layered on top of shared standards?

Agent Contract makes those expectations explicit and machine-checkable.

## Core model

```text
Agent Contract
  + Agent Role / Card
  + Repository Rules
  + Current Task / Acceptance Criteria
  = Concrete Agent
```

The universal contract owns shared semantics such as authority, scope, verification, evidence, handoff, review disposition, and completion. A consuming repository owns project-specific commands, architecture, environment, and product rules.

## Monorepo layout

```text
agent-contract/
├── spec/                    # Stable, tool-agnostic semantics
├── templates/               # Installable repository templates
├── packages/
│   └── cli/                 # `agent-contract init|check`
├── action.yml               # GitHub Action adapter
├── .github/workflows/       # CI + reusable workflow adapters
├── adapters/                # Tool-specific thin adapters
└── examples/                # Reference integrations
```

The CLI is the implementation source of truth for automation. GitHub Actions, CircleCI Orbs, and future adapters should call the CLI rather than reimplementing contract rules.

## Quick start

### 1. Initialize a repository

Until the package is published, run the CLI from a checkout of this repository:

```bash
node packages/cli/src/index.mjs init --root /path/to/your/repo
```

This creates:

- `agent-contract.yml`
- `AGENTS.md`
- `.agents/HANDOFFS.md`

### 2. Validate the contract

```bash
node packages/cli/src/index.mjs check --root /path/to/your/repo
```

### 3. GitHub Actions

```yaml
steps:
  - uses: actions/checkout@v5
  - uses: koshuang/agent-contract@main
```

For production use, pin a released major or immutable version once releases begin.

## v0.1 scope

The first release intentionally focuses on the smallest useful vertical slice:

- [x] Agent Contract specification
- [x] Machine-readable repository manifest
- [x] `AGENTS.md` template
- [x] Structured handoff template
- [x] Dependency-free CLI with `init` and `check`
- [x] GitHub Action adapter
- [ ] Agent Card / role profile specification
- [ ] `verify` command that executes repository-defined gates
- [ ] Package registry release
- [ ] Reusable GitHub workflow
- [ ] CircleCI Orb
- [ ] Codex / Claude Code / Gemini adapters

## Design principles

1. **Evidence over self-reporting.** An agent saying it is done is not completion evidence.
2. **One semantic core.** CI adapters call the CLI; they do not fork policy logic.
3. **Repository-specific rules stay local.** Framework commands and architecture do not belong in the universal spec.
4. **Safe autonomy.** Reversible work can proceed; destructive, security-sensitive, or production-impacting ambiguity must escalate.
5. **Structured handoff.** Downstream agents re-check actual repository/PR/CI state instead of trusting another agent's narrative.
6. **Composable agents.** Roles are layered on the core contract rather than rebuilt as independent prompts.
7. **Versioned evolution.** Consumers can upgrade deliberately instead of copying newer templates by hand.

## Origins

The initial contract is extracted from practices dogfooded in `imhere-tw/avtime-client` and `imhere-tw/avtime-backend`, then generalized so no AVtime-specific technology or product rule is required by the core standard.

## License

MIT
