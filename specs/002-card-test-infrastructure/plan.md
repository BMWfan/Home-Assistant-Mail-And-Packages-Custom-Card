# Plan

## Decision needed from owner
- **Option A (recommended, non-disruptive):** treat `dist/` file as the source. Add devDependencies (eslint, prettier, vitest, jsdom, @playwright/test) with committed `package-lock.json`, `.nvmrc`/`engines` (Node 22 LTS), `npm ci`. Tests load the dist file directly with a mocked `hui-masonry-view` / `hass`. "Bundle consistency" = file parses, version in header == `CARD_VERSION` == package.json, hacs.json filename exists. No build step; bytes identical.
- **Option B:** split into `src/` modules and build via esbuild into the same filename. Requires byte/behaviour parity proof and a reviewed migration; higher risk. Only after owner approval.

## Staged draft PRs (after approval)
1. Tooling: lockfile, Node pin, lint/format, scripts (`npm run lint|test|check`). Config-only; dist untouched.
2. PR CI `.github/workflows/ci.yml` (read-only perms, pinned action versions, `npm ci`); release workflow untouched.
3. Fixture contract tests (entity discovery, universal/17TRACK, OTP/Amazon Hub, image URLs, scan controls, DE/EN, themes).
4. Playwright smoke (render, empty/error, shipment details, language, mobile) with mocked HA.
5. Docs: disposable paired HA + integration test instructions; HA Core/frontend deprecation review (needs network against stable release notes).

## Risks
- Card extends frontend-internal `hui-masonry-view` prototype (fragile across HA frontend releases) - mocks must mimic it; review each stable release.
- Lint rules may flag existing code; use baseline config, no mass reformat of dist.
- Playwright browser download in CI adds time/flakiness.

## Rollback
Each stage is additive (new files/workflow); revert PR. Runtime file never modified under Option A.
