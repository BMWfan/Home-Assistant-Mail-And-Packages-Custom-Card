# Verification

Executed 2026-11-07 in an isolated cloud workspace. No production HA, production
credentials, personal shipment data, merges, deployments or releases were used.

## Inspected revisions and environment

| Input                                              | Revision / observation                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Card default `master`                              | `cceec4744920950c3b5b99be35eb471f860f0afd`                                                             |
| PR #21 prerequisite                                | `ac4753f8b05f360cf56f895ca73d788e90a63bb7` (`codex/spec-002-audit-feasibility-gate`, still open)       |
| Feature branch                                     | `feature/spec-003-paired-ha`, stacked on PR #21                                                        |
| Companion PR #12                                   | `d059f3786e33538a34f3a7134f46c74501aa4e16` (`copilot/spec-001-implement-test-environment`, still open) |
| Companion Docker branch inspected                  | `5bc2d00d5100e197cba4beb07cf17b6cec187c4e`                                                             |
| Actual native HA Core                              | `2026.11.0`                                                                                            |
| Actual frontend requirement reported by running HA | `home-assistant-frontend==20261028.4`                                                                  |
| Python                                             | `3.14.9` installed with uv                                                                             |
| Card verification toolchain                        | Node `22.21.1`; supplied workspace default was Node `24.22.1`                                          |
| Docker / Compose                                   | `29.9.2` / `v2.40.3`; rootless daemon, vfs storage                                                     |

The workspace initially had no checkouts. The companion's existing Compose uses
`:stable`, all-interface ports 8123/5678 and a checked-in configuration containing
a remote production mirror. None of that configuration or its secrets were
loaded. The new runner creates its own config and mounts only copied integration
code plus the card. The companion was inspected and tested without source edits.

## Actual execution

| Command / test                                                              | Result                                                                                                                                     |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm ci`                                                                    | Passed (initial install used supplied Node 24; final checks used Node 22)                                                                  |
| `npm exec --offline --yes --package=node@22.21.1 -- npm run ci`             | Passed: copy build, runtime/tooling ESLint, formatting, 7 contract tests, bundle and metadata checks                                       |
| `npm run test:smoke`                                                        | 8 passed in 4.1s, desktop/Pixel 7 with real Lit and actual control clicks; HA remains mocked                                               |
| `python3 tests/paired/verify-fixtures.py /workspace/integration`            | 6 attribute contracts match actual producer methods from pinned companion source                                                           |
| Broken `package.json.main` pointing at `missing/...`                        | Metadata check correctly exited 1; original metadata restored                                                                              |
| `python3 tests/paired/prepare.py`                                           | Passed: fresh config and exact pinned clone generated                                                                                      |
| `python3 -m compileall -q tests/paired -x runtime`                          | Passed                                                                                                                                     |
| `docker compose -p spec003 -f tests/paired/compose.yaml config --quiet`     | Passed                                                                                                                                     |
| Docker pull of `ghcr.io/home-assistant/home-assistant:2026.11.0`            | **Blocked:** layer extraction returned `no space left on device` at `usr/local/lib/python3.14/site-packages/hass_frontend/frontend_latest` |
| Native `hass -c /workspace/card/tests/paired/runtime/config --log-no-color` | Started actual HA with real integration platforms; bound to loopback 18123; new HTTP settings confirmed                                    |
| `python3 tests/paired/start.py`                                             | Passed: generated disposable owner; token kept only in ignored runtime                                                                     |
| `npm exec --offline --yes --package=node@22.21.1 -- npm run test:paired`    | **2 passed in 15.2s**, actual Lovelace desktop/mobile, Core/frontend above                                                                 |
| Companion `ruff check --no-fix .` / `ruff format --check .`                 | Passed; 72 files formatted                                                                                                                 |
| Companion pytest, with external sockets disabled                            | **663 passed**, 22 warnings, 32.44s; coverage **90.41%**, above required 90%                                                               |
| Companion `mypy custom_components/mail_and_packages/`                       | Passed: 34 source files                                                                                                                    |
| Companion `pip-audit --local --strict --timeout 15 --progress-spinner off`  | Passed: no known vulnerabilities found                                                                                                     |
| `git diff --check`; diff of `src/` and `dist/` against prerequisite         | Passed; runtime bundle bytes unchanged                                                                                                     |

Exact companion installation/execution:

```sh
cd /workspace/integration
uv venv --python 3.14 .venv
uv pip install --python .venv/bin/python -r requirements_test.txt
uv pip install --python .venv/bin/python --no-deps pytest-homeassistant-custom-component==0.13.375
.venv/bin/python -c 'from homeassistant.components import logger; logger._clear_logger_overwrites = lambda hass: None; import pytest; raise SystemExit(pytest.main(["--disable-socket", "--allow-hosts=127.0.0.1,::1,localhost", "--junitxml=/workspace/card/tests/paired/artifacts/companion-results.xml"]))'
```

The logger compatibility shim is the pinned companion's existing tox command.
Native HA auto-installed its component requirements in this venv. Tests were
completed before starting HA; no integration runtime code was changed.

## Paired acceptance matrix

| Check                                             | Actual result / boundary                                                                           |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Lovelace module registration and styled rendering | Passed in actual HA dashboard                                                                      |
| Registry entity discovery                         | Passed with actual `mail_and_packages` registry entries and host-prefixed IDs                      |
| Universal/17TRACK timeline                        | Passed: synthetic coordinator tracking output through actual sensor, card row and clicked timeline |
| Amazon tracking, OTP order mapping, Hub           | Passed: TBA, matched OTP and Hub code visible                                                      |
| Letter previews and URLs                          | Passed: actual sensor-produced `/local/mail_and_packages/letter.svg`, image decoded successfully   |
| Scan service                                      | Passed: clicked card control; real button/platform/coordinator refresh count increased             |
| DE/EN                                             | Passed after switching HA frontend language and reloading                                          |
| Mobile                                            | Passed Pixel 7 Chromium emulation and card viewport-width assertion                                |
| Frontend errors                                   | Final diagnostic run captured zero console/page errors in both projects                            |

## Failures diagnosed and remaining limits

The first mock-browser attempt exposed an incomplete Lit import map, corrected
before the 8-test pass. The first actual run encountered HA's HTTP confirmation
dialog; the test now handles it and uses DOM-ready navigation to avoid waiting
on unrelated external page resources. An initial language test reset English in
its initialization hook on every reload; corrected to preserve the selection.
The repeated generic console `Object` was identified by capturing the actual
unhandled rejection: `unknown_command`. Server logs correlated it with
`recorder/info`; adding recorder to the disposable configuration and bootstrap
dependencies eliminated the failure in a fresh run. The final run passed both
projects with empty error arrays. Screenshots now wait for HA's launch screen
to disappear. No frontend error is filtered or ignored.

Native HA logged an optional missing `libturbojpeg` optimization, an existing
companion `CONN_CLASS_CLOUD_POLL` deprecation (removal in Core 2027.5). These do not establish camera snapshot or driver-photo compatibility.
They are retained in local runtime logs; the successful letter test decodes the
synthetic preview directly. HA's onboarding also created optional default
integrations; no production sources were configured.

**Hosted Docker validation subsequently passed** on tested source revision
`798dde57395e0e7c4b97c6cd1032fc68981ce3e7`:
[paired HA run 42399639592](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/actions/runs/42399639592)
and [card CI run 42399639503](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/actions/runs/42399639503).
Actual Docker Lovelace desktop/mobile: **2 passed in 14.1s**. Companion in the
same HA image: **663 passed**, 18 warnings, 23.00s, **90.37% coverage**.
All setup, producer validation, browser checks, suite, artifact upload and
container/volume cleanup steps succeeded. The
[hosted evidence artifact](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/actions/runs/42399639592/artifacts/13585126917)
contains exact image digest, source provenance, running Core/frontend versions,
console reports, screenshots, HA logs and JUnit results; it expires 2026-11-14.
Artifact archive digest:
`sha256:ddc8db89e46d205b59005def2e0840324cc50f9e4d8bc7bf56f46becc4d793d1`.

The Docker daemon's storage differs from the workspace filesystem, which still
had space; no daemon data was deleted or storage driver changed. Compose syntax,
config preparation, Python syntax, source contracts and the real native HA path
were executed. CI contains unconditional cleanup and explicit artifact selection;
its Docker path was subsequently exercised successfully by the hosted run above.

The paired test injects data at the coordinator boundary. Live IMAP/parsing,
17TRACK API requests, DHL OAuth/image downloads, real Amazon photos, native HA
mobile apps and physical devices remain unverified. Parser/unit tests provide
additional automated coverage but are not live-service certification.

## Review findings from PR #21

Source now receives recommended ESLint correctness checks; only legacy unused
variables and unnecessary escapes are suppressed for `src/`. The build is still
explicitly a byte-for-byte copy, and modularization remains separate scope.
Fixture mapping is documented and checked against pinned producer code, including
corrected letter paths and Amazon attribute dictionaries. The mock harness uses
real Lit styles and events; controls are clicked. Build runs before tests; Node
minimum is 22.12; metadata checks the full `dist/` path; formatting is now gated,
with the inherited formatting baseline normalized. HACS metadata, runtime version
and release workflow are unchanged.

## Review handoff and retained artifacts

Implementation and tested runner revision:
`e67706f7e394cd650192d93d57a242247542164a`. The follow-up handoff/evidence commits change
only this verification record, task completion and hosted evidence summary.
[Draft PR #25](https://github.com/BMWfan/Home-Assistant-Mail-And-Packages-Custom-Card/pull/25)
is stacked on open PR #21 and links issue #24. The disposable native HA process
was stopped after collecting evidence.

Retained evidence includes [paired results](evidence/paired-results.json),
[actual versions](evidence/versions-desktop.json),
[HA log](evidence/ha-native.txt), [companion pytest](evidence/companion-pytest.txt),
[card CI](evidence/card-ci.txt), [mock smoke](evidence/card-smoke.txt),
[input hashes](evidence/input-sha256.json), and desktop/mobile screenshots in both
languages: [desktop DE](evidence/desktop-de.png),
[desktop EN](evidence/desktop-en.png), [mobile DE](evidence/mobile-de.png),
[mobile EN](evidence/mobile-en.png). Generated access/refresh token values were
checked against the retained artifacts and are absent; auth storage is ignored.
