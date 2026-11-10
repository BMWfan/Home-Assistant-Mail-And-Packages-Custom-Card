# Verification

## Commands

- `npm ci`
- `npm run lint`
- `npm run test:contract`
- `npm run build`
- `npm run verify:bundle`
- `npm run verify:metadata`
- `npm run test:smoke`

## Compatibility Matrix

- Home Assistant runtime bundle filename: preserved (`Home-Assistant-Mail-And-Packages-Custom-Card.js`) via `hacs.json` and `package.json` checks.
- HACS metadata behavior: unchanged contract keys; validated by metadata verifier.
- Language compatibility: EN + DE assertions in contract and smoke tests.
- Entity discovery compatibility: registry and fallback default-id paths covered.
- Universal/17TRACK + OTP/Amazon Hub + image URL rendering paths: covered by fixture tests.
- Mobile rendering smoke: Chromium mobile profile smoke run.

## Limitations

- No claim of full HA frontend integration parity; tests use mocked HA APIs/harness.
- No source-architecture rewrite performed due provenance uncertainty.
- Full disposable integration+card paired stack validation remains a manual follow-up against the companion integration repo.

## Follow-ups Requiring Owner Approval

- Migrate from single-file source mirror to modular authored source with transform pipeline.
- Expand browser matrix beyond Chromium and include cross-version HA frontend snapshots.

## Evidence (This Branch)

- `npm run lint`: passed.
- `npm run test:contract`: passed (7 tests).
- `npm run build`: passed; deterministic copy from `src/` to `dist/`.
- `npm run verify:bundle`: passed; byte-for-byte equality confirmed.
- `npm run verify:metadata`: passed; HACS filename and package main aligned.
- `npm run test:smoke`: passed (8 Playwright tests across desktop/mobile Chromium).
- `npm run ci`: passed.

## Follow-up technical review (2026-11-07)

The four open inline findings from PR #21 were verified against its own head,
not only the descendant PR #25. Corrections are now part of this PR: build before
contract execution; Node minimum 22.12 in package/lock/docs; complete entry-point
path plus an actual file check; real Lit styling/events and clicked timeline/scan
controls. Runtime source receives incremental recommended ESLint checks, with
only legacy unused-variable/escape exceptions. Formatting is gated after
normalizing the existing baseline. The build remains a copy, not modular source
compilation; actual paired HA and pinned fixture producer checks remain in #25.

Executed under Node 22.21.1:
`npm run ci` passed (10 tests: 7 card contracts and 3 metadata regressions),
`npm run test:smoke` passed (8 desktop/mobile tests, 4.3s), and the runtime bundle,
HACS metadata and release workflow remain unchanged. The metadata regressions
cover the valid path, a matching basename in the wrong directory and a missing
bundle file. This is a technical review/fix by the implementing agent; human
review and merge authorization remain outstanding.
