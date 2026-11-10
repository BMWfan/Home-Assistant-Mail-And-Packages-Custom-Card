# Repository guidance

This repository distributes the Mail and Packages Home Assistant dashboard
card. Keep work limited to the requested GitHub issue; do not change unrelated
card behavior, release files, or deployment configuration.

## Workflow

Use the GitHub-native path: issue → scoped Copilot task → draft PR → available
CI/checks → independent technical review → owner-approved merge. PR CI runs quality and mock browser checks; the separate paired-HA workflow
runs actual Lovelace and integration platforms with synthetic coordinator input.
Report the exact source revision and checks actually executed. The release
workflow runs on pushes to `master` and can create a release when its version
tag is absent; never merge, publish, or release without explicit owner approval.

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
- The card obtains Lit from frontend-internal `hui-masonry-view`/`hui-view`
  prototypes. Treat this as a compatibility risk: test each supported stable
  Core/frontend pair, and do not infer older/newer compatibility from mocks.
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
- For integration-level tests, use the fresh, pinned, loopback-only runner in
  [tests/paired/README.md](tests/paired/README.md), with compatible revisions of
  both repositories. The companion's historical dev configuration may contain a
  remote HA mirror; do not load it or its secrets for this task. Use synthetic
  data and isolated test accounts only, never production HA/data/credentials.
  Record the coordinator seam and distinguish it from live parser/API tests.
- Do not merge or deploy autonomously. Significant scope, compatibility
  changes, and final merge require owner approval.

## Validation

Use Node `>=22.12.0 <23` and locked installs (`npm ci`). Canonical runtime source
is `src/Home-Assistant-Mail-And-Packages-Custom-Card.js`; `npm run build` copies
it byte-for-byte into `dist/`, without compiling modular authored source.

- `npm run ci`: copy build before contract tests, source/tooling lint, formatting,
  contracts and metadata/bundle checks.
- `npm run test:smoke`: real Lit/styles/events with mocked HA APIs; not actual HA.
- `npm run test:paired`: actual disposable HA/Lovelace and companion platforms,
  after the documented runner preparation and onboarding.

Consult [SPEC-002 verification](specs/002-card-test-infrastructure/verification.md)
and [SPEC-003 verification](specs/003-paired-home-assistant/verification.md) for
actual results and limitations. Source lint has documented legacy suppressions;
HACS metadata checks are not HACS acceptance certification. Separate automated,
manual and unverified checks. No live accounts are currently configured; do not
claim live IMAP, 17TRACK or DHL verification from synthetic coordinator tests.
