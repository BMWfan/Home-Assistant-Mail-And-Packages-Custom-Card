# Repository guidance

This repository distributes the Mail and Packages Home Assistant dashboard
card. Keep work limited to the requested GitHub issue; do not change unrelated
card behavior, release files, or deployment configuration.

## Workflow

Use the GitHub-native path: issue → scoped Copilot task → draft PR → available
CI/checks → independent technical review → owner-approved merge. This
repository currently has no pull-request CI workflow; do not claim a CI pass
when no checks ran. The release workflow publishes on pushes to `master`, so
never merge, publish, or release without explicit owner approval.

Apply the NetClaw-inspired `specs/NNN-slug/` convention proportionately:

- **S — small fix:** issue, focused PR, and regression test; no standalone
  specification.
- **M — bounded feature:** concise `spec.md`, task checklist, tests, and
  compatibility review.
- **L — architecture, security, or migration:** `spec.md`, `plan.md`,
  `tasks.md`, and explicit verification, risks, migration, and rollback
  evidence. Split implementation into small PRs when useful.

Do not create a specification for every prompt, trivial fix, CI rerun, or
review comment. A specification must identify its scope, non-goals, acceptance
criteria, dependencies, documentation impact, rollback, and human approval
gate. See [SPEC-001](specs/001-sdd-light-workflow/spec.md) for this policy.

## Compatibility and safety

- Before frontend changes, check the current stable Home Assistant release,
  relevant frontend API deprecations, and the HACS metadata in `hacs.json`.
  The declared minimum version is not proof of compatibility with current
  releases; do not change it without a scoped issue and evidence.
- For HACS-facing changes, review the current HACS metadata requirements and
  verify the configured `filename` exists in `dist/`. JSON parsing alone is
  not HACS validation.
- The [Mail and Packages integration](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages)
  is a separate repository. Preserve or explicitly coordinate the card
  contract: entity-registry auto-discovery and entity IDs/platforms;
  universal shipment and 17TRACK status, location, time, and event data; OTP
  order mapping and Hub pickup codes; driver-photo and DHL letter image URLs;
  scan button/action; themes; and German/English text. Breaking contract
  changes require explicit cross-repository coordination and versioning.
- For integration-level manual testing, use a disposable Home Assistant
  instance with compatible revisions of both repositories, following the
  integration's
  [Docker handoff](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages/blob/feature/docker-devcontainer/HANDOFF.md).
  Use test data and isolated test accounts only. Never use production HA,
  production data, or production credentials.
- Do not merge or deploy autonomously. Significant scope, compatibility
  changes, and final merge require owner approval.

## Validation

This checkout has a prebuilt JavaScript bundle in `dist/`, but no source tree,
dependency lockfile, npm scripts, test suite, or pull-request CI workflow.
Do not invent build or test commands or claim coverage that was not run.
Choose checks appropriate to the change, use the exact available commands in
[SPEC-001 verification](specs/001-sdd-light-workflow/verification.md), and
record manual and unavailable checks separately. Contract changes should be
reviewed with the companion integration and tested in the disposable paired
environment when feasible.
