"""Execute pinned companion attribute producers without importing HA.

AST extraction retains method bodies unchanged; this checks the fixture mapping,
not coordinator parsing or HA entity lifecycle (covered only by the paired job).
"""
import ast
import json
from pathlib import Path
import subprocess
import sys
from types import SimpleNamespace

root = Path(__file__).resolve().parents[2]
repo = Path(sys.argv[1]).resolve()
versions = json.loads((root / "tests/paired/versions.json").read_text())
assert subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=repo, text=True).strip() == versions["integration_sha"], "Companion revision mismatch"
component = repo / "custom_components/mail_and_packages"
namespace = {}
for node in ast.parse((component / "const.py").read_text()).body:
    if isinstance(node, ast.Assign) and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
        for target in node.targets:
            if isinstance(target, ast.Name):
                namespace[target.id] = node.value.value
source = ast.parse((component / "sensor.py").read_text())
producer = next(node for node in source.body if isinstance(node, ast.ClassDef) and node.name == "PackagesSensor")
producer.bases = []
producer.body = [node for node in producer.body if isinstance(node, ast.FunctionDef) and node.name in {"extra_state_attributes", "_add_amazon_attributes", "_add_dhl_brief_attributes"}]
exec(compile(ast.fix_missing_locations(ast.Module(body=[producer], type_ignores=[])), str(component / "sensor.py"), "exec"), namespace)
fixture = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", 'import {createHassFixture} from "./tests/fixtures/hass-fixtures.js"; console.log(JSON.stringify(createHassFixture()));'], cwd=root, text=True))["states"]
mapping = {
    "sensor.mail_universal_packages": ("universal_packages", "Mail Universal Packages", {"universal_tracking_details": fixture["sensor.mail_universal_packages"]["attributes"]["tracking_details"]}),
    "sensor.mail_amazon_packages": ("amazon_packages", "Mail Amazon Packages", {"amazon_order": ["111-2222222-3333333"]}),
    "sensor.mail_amazon_packages_delivered": ("amazon_delivered", "Mail Amazon Packages Delivered", {"amazon_delivered_orders": ["111-2222222-3333333"]}),
    "sensor.mail_amazon_otp_code": ("amazon_otp", "Mail Amazon OTP Code", {"amazon_otp_code": ["654321"], "amazon_otp_details": [{"order": "111-2222222-3333333", "code": "654321"}]}),
    "sensor.mail_amazon_hub_packages": ("amazon_hub", "Mail Amazon Hub Packages", {"amazon_hub_code": ["HUB-77"]}),
    "sensor.dhl_letter_preview": ("dhl_brief_anzahl", "DHL Letter Preview", {"dhl_brief_letters": [{"id": "letter-1", "date": "07.11.2026", "image_path": "/config/www/mail_and_packages/letter-1.jpg"}, {"id": "letter-2", "date": "08.11.2026", "image_path": "/config/www/mail_and_packages/letter-2.jpg"}]}),
}
for entity_id, (key, name, data) in mapping.items():
    entity = namespace["PackagesSensor"]()
    entity.type, entity._name, entity._tracking_key = key, name, "unused"
    entity._config = SimpleNamespace(data={"amazon_domain": "amazon.de"})
    if "Amazon" in name:
        data["amazon_order_tracking"] = {"111-2222222-3333333": "TBA123456789"}
    entity.coordinator = SimpleNamespace(data=data)
    assert entity.extra_state_attributes == fixture[entity_id]["attributes"], (entity_id, entity.extra_state_attributes, fixture[entity_id]["attributes"])
print(f"6 fixture attribute contracts match companion {versions['integration_sha']} actual sensor producers")
