# Disposable paired HA runner (SPEC-003)

This runner **does not read the companion's `config/`, `.env`, secrets or remote
HA configuration**. It creates a fresh directory and refuses to overwrite it.
Only the integration code is copied. HA is published on `127.0.0.1:18123`, with
no debug port, restart policy, production credentials or real mail images.

## Reproduce

Prerequisites: Git, Python 3, Node 22.12–22.x, npm, Docker Compose v2, Chromium
system dependencies, and enough Docker storage for the official HA image
(allow at least 15 GB on a normal overlay filesystem; vfs can require more).
No existing HA instance or account is needed. Start from the card feature branch.

```sh
npm ci
npm run ci
npx playwright install --with-deps chromium
python3 tests/paired/prepare.py
python3 tests/paired/verify-fixtures.py tests/paired/runtime/integration
docker compose -p spec003 -f tests/paired/compose.yaml up -d --wait
python3 tests/paired/start.py
npm run test:paired
# Always stop the disposable stack, including after a failed test:
docker compose -p spec003 -f tests/paired/compose.yaml down -v --remove-orphans
```

`runtime/` contains a generated test owner password/token and HA `.storage`.
Never upload it. After stopping the stack, remove only `tests/paired/runtime/`
to start a fresh run. Screenshots, browser failures, exact running Core/frontend
requirements, image digest and source revisions go in `artifacts/`. CI uploads
only that directory with a seven-day retention period.

The `Disposable paired Home Assistant` workflow runs these commands on an
Ubuntu hosted runner for PRs and manual dispatch. It also runs the companion
pytest suite inside the pinned HA/Python image. It has read-only repository
permissions, no secrets, no production URLs and no release/deployment actions.
The image is pinned to Core 2026.11.0; CI records its resolved digest and actual
frontend requirement rather than assuming a frontend version. The card is the
checked-out PR commit; `versions.json` records its prerequisite PR #21 revision
and the companion revision. To upgrade, update the pins intentionally and rerun
both producer checks and paired tests.

## What runs, and the synthetic boundary

`bootstrap/` is a **test-only custom integration**, never part of `dist` or HACS.
It creates a real `mail_and_packages` config entry and loads the companion's real
sensor/camera/button platforms. It replaces only
`MailDataUpdateCoordinator._async_update_data` with deterministic synthetic
tracking, Amazon and letter data. It enables Amazon entities through HA's actual
entity registry and reloads the entry. The real scan button calls the actual
coordinator refresh; the test observes an increasing refresh counter.

The minimal config includes recorder because the real frontend calls
`recorder/info`; omitting it caused an unhandled frontend rejection.

The browser logs into actual HA and opens a YAML Lovelace dashboard with the
card registered as a module resource. It checks entity-registry discovery,
universal/17TRACK-shaped timeline content, Amazon tracking/OTP/Hub (three arriving orders with two distinct matched codes,
an order without a code, a separate delivered order and an orphan code), a successfully
loaded `/local/` letter image, the scan control, DE/EN, viewport width and browser
errors on desktop and Pixel 7 emulation. There is no `window.mountCard` or fake
`hui-view` in this paired test.

This validates the **coordinator-output → entity → HA frontend → card** path.
It does **not** exercise IMAP authentication/parsing, live 17TRACK enrichment,
DHL OAuth/downloads, external Amazon photos, native mobile apps or physical
phones. Those require separate synthetic server fixtures or isolated test
accounts. Live external calls are deliberately absent.

## Fixture provenance

The mock fixtures remain synthetic. `verify-fixtures.py` verifies the companion
checkout SHA, extracts and executes the actual attribute-producing methods from
its `sensor.py` using AST (without importing HA), and compares six fixture
attribute dictionaries with their output. Constants come from the pinned
`const.py`; method bodies are not reimplemented. This catches dictionary/key and
letter URL drift, but is not an end-to-end integration test.

| Card fixture                          | Companion producer / coordinator keys                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| universal `tracking_details`          | `PackagesSensor.extra_state_attributes`, `universal_tracking_details`                        |
| Amazon `order`, `tracking`            | `_add_amazon_attributes`, `amazon_order`, `amazon_delivered_orders`, `amazon_order_tracking` |
| OTP `code`, `details`                 | `_add_amazon_attributes`, `amazon_otp_code`, `amazon_otp_details`                            |
| Hub `code`                            | `_add_amazon_attributes`, `amazon_hub_code`                                                  |
| letters `id`, `date`, `/local/` image | `_add_dhl_brief_attributes`, `dhl_brief_letters[].image_path`                                |
| scan                                  | `button.py:MailScanNowButton.async_press` → `async_request_refresh` (paired test only)       |

Entity IDs in the mock remain illustrative names; the paired test discovers the
IDs generated by actual HA. Producer checks do not certify parser output or
17TRACK history schemas. See the companion's parser/unit suite for those layers.

## Native Python alternative

If Docker storage is insufficient, actual HA can also run from a Python 3.14
virtual environment. Use a **new runtime directory**, then:

```sh
python3 tests/paired/prepare.py --local
uv venv --python 3.14 tests/paired/runtime/venv
uv pip install --python tests/paired/runtime/venv/bin/python homeassistant==2026.11.0
# Keep this process in a dedicated terminal; stop it after the browser tests.
tests/paired/runtime/venv/bin/python tests/paired/run-native.py
# In another terminal, immediately onboard and run the tests:
python3 tests/paired/start.py
npm run test:paired
```

The native launcher accepts only a fresh config marked by `prepare.py --local`.
It validates settings through the pinned HA's own HTTP schema and seeds a stable
`127.0.0.1:18123` configuration before HA starts. There is no pending HTTP trial,
rollback timer or default all-interface fallback; used `.storage` is rejected.
Start through this launcher, not the bare `hass` entry point. The paired tests
assert that the HTTP configuration has no pending trial or scheduled revert.
Native camera optimization optionally needs the
OS `libturbojpeg` library; a missing library is recorded separately from letter
preview loading. The local execution used the companion's Python test venv
instead of a second venv; Core/frontend versions are recorded in verification.

The OTP contract regression deliberately shuffles detail order and checks each
tracking-number/code pair. The actual HA test scopes assertions to individual
shipment rows and keeps the orphan code outside those rows. It also checks the
DHL timeline's event/location and horizontal row/document overflow in DE/EN.
