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
