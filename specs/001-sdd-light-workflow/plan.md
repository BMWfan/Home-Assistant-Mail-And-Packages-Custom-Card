# SPEC-001 plan

## Approach

1. Audit repository files, scripts, workflows, HACS metadata, and README before
   editing.
2. Add one reusable `AGENTS.md` and a short README contributor section; do not
   repeat the full rules in both places.
3. Record SPEC-001 scope, completed documentation tasks, and exact available
   verification in this directory.
4. Check internal and companion links, run the applicable static commands,
   and confirm no shipped or release files changed.

## Repository constraints

The repository currently has `dist/Home-Assistant-Mail-And-Packages-Custom-Card.js`
as its only card implementation file. `package.json` has metadata but no
scripts; there is no lockfile, source tree, test suite, lint/build setup, or
pull-request CI workflow. The only workflow, `.github/workflows/release-on-master.yml`,
creates releases on pushes to `master` or manual dispatch. Therefore this plan
adds no tooling and makes no assertion of functional/browser test coverage.

## Compatibility and rollback

Documentation-only change: the card bundle and HACS/release settings stay
unchanged. Review current stable Home Assistant frontend APIs and deprecation
notices before future behavior changes; re-check the `homeassistant` value in
`hacs.json` rather than treating its existing `0.100` declaration as current
compatibility evidence. Cross-repository behavior must remain compatible or be
coordinated explicitly. The documentation can be reverted without data or
migration impact.

The change follows the GitHub path in [SPEC-001](spec.md): draft PR, available
checks, independent review, then owner-approved merge. No release or production
test is part of the plan.
