"""Start fresh disposable HA with stable HTTP and loopback-only fallbacks.

Uses the pinned HA's own schema and process-local fallback defaults. No pending
trial or bind failure may change this test process to an all-interface listener.
"""
import json
from pathlib import Path
import sys


def prepare_http(config):
    from homeassistant.components.http import config as http_config
    from homeassistant.util.dt import utcnow

    if not (config / ".spec003-native").is_file():
        raise RuntimeError("Run prepare.py --local to create a fresh native test config")
    # Refuse used storage before starting HA or loading persisted integrations.
    storage = config / ".storage"
    storage.mkdir(mode=0o700)
    stable = dict(http_config.HTTP_STORAGE_SCHEMA({
        "server_host": ["127.0.0.1"], "server_port": 18123,
    }))
    stable.update(created_at=utcnow().isoformat(), error=None, error_message=None)
    with (storage / http_config.STORAGE_KEY).open("x") as output:
        json.dump({"version": http_config.STORAGE_VERSION,
                   "minor_version": http_config.STORAGE_MINOR_VERSION,
                   "key": http_config.STORAGE_KEY, "data": {"stable": stable,
                   "pending": None, "yaml_migration_done": True}}, output)
    (storage / http_config.STORAGE_KEY).chmod(0o600)
    # HA also has a fallback chain after bind failures. Restrict every default
    # for this disposable process, without modifying installed HA package files.
    http_config._DEFAULT_CONFIG = dict(stable)
    http_config._DEFAULT_CONFIG_LEGACY_PORT = dict(stable)


def main():
    from homeassistant.const import __version__
    from homeassistant.__main__ import main as ha_main

    here = Path(__file__).resolve().parent
    versions = json.loads((here / "versions.json").read_text())
    if __version__ != versions["ha_core"]:
        raise RuntimeError("Native HA must match the pinned Core version")
    config = here / "runtime/config"
    prepare_http(config)
    print("Starting fresh HA with stable loopback HTTP and loopback-only fallbacks", flush=True)
    sys.argv = ["hass", "-c", str(config), "--log-no-color"]
    return ha_main()


if __name__ == "__main__":
    raise SystemExit(main())
