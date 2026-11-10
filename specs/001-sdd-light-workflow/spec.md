# SPEC-001: SDD-Light workflow and Home Assistant compatibility policy

**Status:** Documentation change
**Parent:** [Epic #17](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/issues/17)
**Issue:** [#18](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/issues/18)
**Companion:** [Mail and Packages integration](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages)

## Problem

The card repository has no repository-specific agent or contributor guidance.
Its README describes card usage, but does not define a proportional
specification workflow, cross-repository compatibility review, or safe
validation expectations.

## Scope

- Add focused repository instructions and concise contributor guidance.
- Adopt the `specs/NNN-slug/` naming convention and S/M/L documentation
  proportionality.
- Establish GitHub-native issues → scoped Copilot work → draft PR → available
  CI/checks → independent review → owner-approved merge.
- Document Home Assistant stable-release/deprecation review, frontend/HACS
  validation, cross-repository contracts, and disposable paired-HA testing.
- Record the current validation capabilities and limits accurately.

## Non-goals

- Do not change card functionality, the shipped bundle, HACS metadata, release
  behavior, or existing project files beyond contributor documentation.
- Do not add a build, lint, test, or CI system in this documentation change.
- Do not publish, merge, or test against production.

## Requirements and acceptance criteria

1. `AGENTS.md` is the reusable repository-specific source for workflow and
   safety guidance; README guidance stays concise and links to it.
2. S/M/L work is proportional: S does not require a spec; M uses a concise
   spec and tasks; L adds planning and explicit verification, risk, migration,
   and rollback evidence.
3. Issues, draft PRs, available checks, independent review, and owner-approved
   merge are explicit. No automated merge or unapproved release is allowed.
4. Contributors review the current stable Home Assistant release, relevant
   frontend deprecations, and HACS compatibility before affected changes.
5. Entity discovery and IDs/platforms, universal/17TRACK shipment data,
   status/location/time, OTP/Hub mapping, driver and DHL letter images, scan
   action, themes, and DE/EN remain explicit compatibility contracts.
6. Manual integration-level testing uses a disposable paired Home Assistant
   environment and test data/accounts, never production.
7. Documentation describes existing checks without claiming absent source,
   tests, build/lint commands, or PR CI.
8. Link targets resolve and documented commands match the repository.

## Dependencies and review gate

The companion integration has its own lifecycle and approvals. Refer to its
[Docker handoff](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages/blob/feature/docker-devcontainer/HANDOFF.md)
for paired testing. Coordinate any breaking contract change with a linked
issue or PR in both repositories. Owner approval is required before merge,
release, or deployment.
