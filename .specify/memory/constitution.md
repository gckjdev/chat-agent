<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: (none renamed)
- Added sections: X. First Principles Thinking
- Removed sections: None
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (footer version reference)
  ✅ .specify/memory/constitution.md (this file)
- Follow-up TODOs: None
-->

# Chat Agent Constitution

## Core Principles

### I. Simplicity First (NON-NEGOTIABLE)
Prefer the simplest design that solves the problem. Delete complexity aggressively. If a reader needs a diagram to understand a function, it is too complex.

### II. Correctness and Readability over Cleverness
Readable code that is obviously correct beats tricky code. Names must explain intent; control flow should avoid deep nesting; use guard clauses and early returns.

### III. Small, Reversible Changes
Make minimal, well-scoped edits with clear intent. Each change should be easy to review, easy to revert, and come with tests.

### IV. Performance and Resource Awareness
Measure before optimizing; do not ship accidental regressions. Avoid unnecessary allocations, blocking I/O on hot paths, and N+1 patterns.

### V. Clear Interfaces and Ownership
Define explicit interfaces and single owners for behaviors. Avoid leaky abstractions and magical side effects. Public APIs are stable contracts.

### VI. Fail Fast with Actionable Signals
Errors must contain context and be easy to debug. No silent catches. Log concisely with identifiers and user impact.

### VII. Tests are Contracts
Tests must be deterministic, fast, and meaningful. No flakiness tolerated. Integration tests validate user-facing behavior; unit tests protect core logic.

### VIII. Explicit over Implicit
Favor explicit types, names, and data flow. Hidden globals, ambient state, and implicit mutations are discouraged.

### IX. Pragmatism over Purity
Prefer practical solutions that ship value without compromising reliability. Abstract later, not sooner.

### X. First Principles Thinking
Decompose problems to fundamentals and reason up from facts:
- Define the outcome and constraints explicitly. Avoid solution-first framing.
- Identify invariants and real bottlenecks via measurement, not assumptions.
- Replace analogies with first-order models; validate with small experiments.
- When consensus relies on tradition, re-derive and justify or remove it.

## Development Workflow

- Trunk is protected. All work lands via PRs from topic branches.
- PRs must be small, pass CI, and include tests when behavior changes.
- Commit messages describe the user impact first, then technical detail.
- Code style: match existing conventions; do not reformat unrelated code.

## Quality Gates

- Lint and type checks must pass.
- Unit and integration tests must be green locally and in CI.
- No new flaky tests. Performance budgets enforced on critical paths.
- Public API changes require a brief migration note in the PR.

## Observability and Logging

- Logs are concise and actionable; include request IDs and error codes.
- Avoid noisy logs; every line must earn its keep.
- Metrics and traces exist for critical user flows.

## Security and Privacy

- Secrets never enter source control. Environment variables only.
- Minimize data collection; log redaction by default for user data.

## Governance

- This constitution supersedes ad-hoc practices. Exceptions require written justification in the PR description.
- Amendments are made via PR that updates this file, with version bump and rationale.

**Version**: 1.1.0 | **Ratified**: 2025-09-28 | **Last Amended**: 2025-09-28