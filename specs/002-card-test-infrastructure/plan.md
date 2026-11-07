# Plan

## Implementation Plan

1. Establish deterministic local toolchain and lock dependencies.
2. Introduce source mirror (`src/`) and deterministic build/verification scripts.
3. Add fixture-driven contract tests around runtime API and rendering contract.
4. Add Playwright smoke harness/tests with mocked HA APIs.
5. Add least-privilege PR CI workflow; keep release workflow unchanged.
6. Update README with local commands, disposable paired setup context, and limits.
7. Record evidence, compatibility matrix, and residual risks.

## Risks

- Dist/source drift if edits are made to only one file.
- Browser harness divergence from full HA frontend environment.
- Playwright dependency/runtime overhead on CI runners.

## Mitigations

- Enforce byte-for-byte checks (`verify:bundle`, `git diff` dist gate in CI).
- Keep tests focused on stable contract behavior (discovery, rendering states, actions).
- Split quality and smoke jobs for clear diagnostics.

## Rollback

1. Revert `pr-ci.yml`, tooling configs, and test directories.
2. Remove `src/` mirror and scripts if migration strategy changes.
3. Preserve `dist/` bundle and `release-on-master.yml` unchanged at all times.
