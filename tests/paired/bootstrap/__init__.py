"""TEST ONLY: real integration setup with synthetic coordinator input.

Never installed outside the generated disposable configuration. External IO is
replaced at the coordinator boundary; entity platforms and services are real.
"""
from copy import deepcopy
from datetime import UTC, datetime
import json
from pathlib import Path
from types import MappingProxyType

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.helpers import entity_registry as er
from homeassistant.loader import async_get_integration


async def async_setup(hass, config):
    # Ensure the pinned integration's own requirements are installed before import.
    from homeassistant.requirements import async_get_integration_with_requirements
    await async_get_integration_with_requirements(hass, "mail_and_packages")
    from custom_components.mail_and_packages.const import CONFIG_VER
    from custom_components.mail_and_packages.coordinator import MailDataUpdateCoordinator

    source = json.loads(await hass.async_add_executor_job(
        Path(hass.config.path("synthetic-data.json")).read_text
    ))

    async def synthetic_update(self):
        data = deepcopy(source)
        data["mail_updated"] = datetime.now(UTC)
        count = int(hass.states.get("sensor.spec003_refresh_count").state) + 1 if hass.states.get("sensor.spec003_refresh_count") else 1
        hass.states.async_set("sensor.spec003_refresh_count", count)
        return data

    # Intentional test seam. No mailbox, DHL, or 17TRACK credentials or IO.
    MailDataUpdateCoordinator._async_update_data = synthetic_update
    entry = ConfigEntry(
        version=CONFIG_VER, minor_version=1, domain="mail_and_packages",
        title="SPEC-003 synthetic mailbox", source="user", unique_id="spec003",
        discovery_keys=MappingProxyType({}), options={}, subentries_data=[],
        data={"host": "spec003.invalid", "port": 993, "username": "synthetic",
              "password": "unused", "scan_interval": 1440, "amazon_enabled": True,
              "dhl_brief_enabled": True, "amazon_domain": "amazon.de",
              "image_path": hass.config.path("www/mail_and_packages"),
              "image_name": "mail_today.gif", "gif_duration": 5,
              "image_security": False, "custom_img": False},
    )
    await hass.config_entries.async_add(entry)
    if entry.state is not ConfigEntryState.LOADED:
        raise RuntimeError(f"Paired integration setup failed: {entry.state}")

    # Amazon sensors default disabled in the companion. Enable through the real
    # registry, then reload, as an owner would do in Settings > Entities.
    registry = er.async_get(hass)
    for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
        if entity.domain == "sensor" and "amazon" in entity.entity_id:
            registry.async_update_entity(entity.entity_id, disabled_by=None)
    await hass.config_entries.async_reload(entry.entry_id)
    integration = await async_get_integration(hass, "frontend")
    hass.states.async_set("sensor.spec003_ready", "ready", {
        "core": __import__("homeassistant.const", fromlist=["__version__"]).__version__,
        "frontend_requirements": integration.requirements,
        "integration_entry": entry.entry_id,
        "boundary": "synthetic coordinator input; real HA platforms/services",
    })
    return True
