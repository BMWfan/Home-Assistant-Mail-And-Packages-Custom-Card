"""Regression tests for the native launcher's exposure and reuse guards."""
import importlib.util
import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

from homeassistant.components.http import config as http_config

spec = importlib.util.spec_from_file_location("native", Path(__file__).with_name("run-native.py"))
native = importlib.util.module_from_spec(spec)
spec.loader.exec_module(native)


class NativeGuardTests(unittest.TestCase):
    def setUp(self):
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.config = Path(self.temp.name)
        self.marker = self.config / ".spec003-native"

    def test_unmarked_directory_is_rejected_before_storage_is_created(self):
        with self.assertRaisesRegex(RuntimeError, "prepare.py --local"):
            native.prepare_http(self.config)
        self.assertFalse((self.config / ".storage").exists())

    def test_existing_storage_is_not_overwritten(self):
        self.marker.touch()
        storage = self.config / ".storage"
        storage.mkdir()
        (storage / "sentinel").write_text("keep")
        with self.assertRaises(FileExistsError):
            native.prepare_http(self.config)
        self.assertEqual((storage / "sentinel").read_text(), "keep")

    def test_stable_and_bind_failure_defaults_are_loopback_only(self):
        self.marker.touch()
        with patch.object(http_config, "_DEFAULT_CONFIG"), patch.object(http_config, "_DEFAULT_CONFIG_LEGACY_PORT"):
            native.prepare_http(self.config)
            data = json.loads((self.config / ".storage/http").read_text())["data"]
            self.assertIsNone(data["pending"])
            self.assertTrue(data["yaml_migration_done"])
            for config in [data["stable"], http_config._DEFAULT_CONFIG, http_config._DEFAULT_CONFIG_LEGACY_PORT]:
                self.assertEqual(config["server_host"], ["127.0.0.1"])
                self.assertEqual(config["server_port"], 18123)


if __name__ == "__main__":
    unittest.main()
