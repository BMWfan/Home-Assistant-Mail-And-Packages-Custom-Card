# SPEC-003: disposable paired Home Assistant

Issue: [#24](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/issues/24).
Size: L (cross-repository test infrastructure). Follow the existing SDD-Light
spec/plan/tasks/verification convention; no runtime redesign.

## Scope and acceptance

Inspect [PR #21](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/pull/21)
and the companion's Docker development branch and PR #12. Pin both source
revisions and HA; provide a fresh, loopback-only paired runner and hosted CI.
Test actual Lovelace registration/rendering and actual integration entity
platforms with synthetic coordinator input: registry discovery, tracking,
OTP/Hub, preview URLs, scan refresh, DE/EN, mobile and frontend errors. Record
executed commands, pass/fail, Core/frontend provenance and limitations.

Address source lint exclusions, fixture provenance and copy-build wording.
Include the remaining mechanical review fixes: build before contract tests,
Node minimum, complete metadata path, real Lit/clicks in mock browser tests and
formatting CI. Preserve HACS and runtime bundle bytes.

Acceptance allows an explicit environment blocker plus executable CI alternative;
unexecuted paired checks must remain open. A mock browser pass is not an HA pass.

## Dependencies, non-goals and documentation

Depends on unmerged PR #21 and companion PR #12 pinned in `tests/paired/versions.json`.
Docker storage, browser dependencies and network package access are prerequisites.
No production HA, real credentials, personal mail/shipment data, releases,
merges, source modularization or live carrier authentication. Update README,
runner documentation and verification evidence. The copy build is not modular
source compilation; defer migration to a separate owner-approved SPEC.

## Rollback and approval

Revert this scoped feature commit to remove runner and review follow-ups.
No runtime, production configuration or HACS migration is involved. Owner review
and approval are required before merge/release; this work ends with a Draft PR.
