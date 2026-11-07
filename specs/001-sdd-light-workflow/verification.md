# SPEC-001 verification

## Repository checks

Run these from the repository root:

```sh
node --check dist/Home-Assistant-Mail-And-Packages-Custom-Card.js
python3 -m json.tool package.json >/dev/null
python3 -m json.tool hacs.json >/dev/null
test -f "dist/$(python3 -c 'import json; print(json.load(open("hacs.json"))["filename"])')"
git diff --check
```

`node --check` checks JavaScript syntax only; it is not a build or behavior
test. The JSON commands validate syntax, not HACS acceptance or Home Assistant
compatibility. There is no source tree, npm script, test suite, or PR CI
workflow in the audited repository. Do not run or report `npm test`, `npm run
build`, browser coverage, or CI results unless that infrastructure is added
and the checks are actually run.

## Documentation and contract review

- Confirm internal links point to `AGENTS.md` and the SPEC-001 files.
- Confirm external links target the intended integration repository, its
  paired-HA handoff, and [Epic #17](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/issues/17).
- Review the README behavior and HACS metadata before changing the documented
  compatibility contract.
- For future card behavior changes, compare entity discovery and the
  universal/17TRACK, status/location/time, OTP/Hub, image URL, scan, theme,
  and localization contracts against the companion integration. Record
  automated and manual evidence separately.

## Paired Home Assistant testing

When a behavior or cross-repository contract requires manual integration
testing, follow the companion repository's
[disposable Docker handoff](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages/blob/feature/docker-devcontainer/HANDOFF.md)
with compatible revisions of both repositories. Use an isolated disposable
instance, test data, and test-only accounts. Production HA, production data,
and production credentials are out of scope. Do not claim paired-HA testing
unless it was actually performed.

## SPEC-001 results

- Passed `node --check dist/Home-Assistant-Mail-And-Packages-Custom-Card.js`.
- Passed JSON parsing for `package.json` and `hacs.json`.
- Confirmed the filename configured by `hacs.json` exists in `dist/`.
- Passed `git diff --check`.
- Confirmed all relative Markdown links in `README.md`, `AGENTS.md`, and the
  SPEC-001 documents resolve to existing files.
- Confirmed the companion integration repository, its linked Docker handoff,
  and Epic #17 are reachable. The issue #18 reference is to the issue being
  addressed by this change.
- No functional, browser, build, or CI checks were run or claimed. The
  documentation-only change leaves the shipped bundle, HACS metadata,
  package metadata, and release workflow unchanged.
