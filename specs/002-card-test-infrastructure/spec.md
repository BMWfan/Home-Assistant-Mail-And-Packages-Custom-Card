# SPEC-002: Reproducible Custom Card builds, PR CI and compatibility tests

## Context

- Repository currently ships a single distributed runtime bundle in `dist/` and lacks authoritative maintainable upstream source files, lockfile-based tooling, lint/test scripts, or PR CI.
- HACS contract and runtime behavior must stay intact (`hacs.json` filename and `dist/Home-Assistant-Mail-And-Packages-Custom-Card.js`).

## Feasibility Gate Outcome

- Authoritative historical source provenance is not available in this branch history.
- To avoid risky decompilation/rewrite, the current distributed bundle is promoted to a canonical tracked source mirror at `src/Home-Assistant-Mail-And-Packages-Custom-Card.js`.
- Build process is intentionally byte-for-byte copy from `src/` to `dist/`; no transpilation/minification transformation in this change.
- Any future refactor to split/modernize source requires explicit owner approval and separate migration plan.

## Scope

- Deterministic Node toolchain (`.nvmrc`, lockfile, scripts) and reproducible build/consistency checks.
- PR CI workflow (least privilege) for lint, contract tests, build, bundle consistency, metadata contract, and Playwright smoke tests.
- Fixture-based contract tests for entity discovery, universal/17TRACK rows, OTP/hub codes, image URLs, scan controls, DE/EN language behavior, and theme variable compatibility.
- Playwright smoke tests with mocked HA APIs for list render, empty state, missing-integration error state, details timeline, language, and mobile profile.
- SDD-Light documentation and compatibility/limitations evidence.

## Out of Scope

- Rewriting card runtime logic.
- Modifying production HA deployment, repository protection, or release-on-master workflow behavior.
- Publishing/merging releases.

## Acceptance Criteria Mapping

- Repeatable commands: provided via npm scripts (`lint`, `build`, `test:contract`, `test:smoke`, `ci`).
- Locked build: `package-lock.json` + `.nvmrc` + deterministic copy build.
- CI coverage: PR workflow runs lint/tests/build/consistency/metadata/smoke.
- Runtime/distribution unchanged: bundle-copy model preserves dist filename and behavior contract.
- Limitations documented: source provenance and migration follow-up captured in verification.
