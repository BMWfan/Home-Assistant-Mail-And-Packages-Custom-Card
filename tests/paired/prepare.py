"""Create a new disposable config; refuse to reuse any existing runtime."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("--local", action="store_true", help="Bind native Python HA to loopback:18123")
args = parser.parse_args()

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
VERSIONS = json.loads((HERE / "versions.json").read_text())
RUNTIME = HERE / "runtime"
RUNTIME.mkdir()  # Deliberately fails on existing data rather than overwrite it.
repo = RUNTIME / "integration"
subprocess.run(["git", "clone", "https://github.com/" + VERSIONS["integration_repository"] + ".git", str(repo)], check=True)
subprocess.run(["git", "-C", str(repo), "checkout", "--detach", VERSIONS["integration_sha"]], check=True)
config = RUNTIME / "config"
(config / "custom_components").mkdir(parents=True)
shutil.copytree(repo / "custom_components/mail_and_packages", config / "custom_components/mail_and_packages")
shutil.copytree(HERE / "bootstrap", config / "custom_components/spec003")
shutil.copytree(ROOT / "dist", config / "www/mail-packages-card")
(config / "www/mail_and_packages").mkdir()
# Synthetic preview; no personal mail scans.
(config / "www/mail_and_packages/letter.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120"><rect width="240" height="120" fill="white"/><text x="20" y="60">SPEC-003 synthetic letter</text></svg>')
(config / "configuration.yaml").write_text('''homeassistant:
  name: SPEC-003 Disposable
  latitude: 0
  longitude: 0
  elevation: 0
  unit_system: metric
  time_zone: UTC
frontend:
api:
http:
config:
sensor:
button:
camera:
recorder:
spec003:
logger:
  default: info
lovelace:
  mode: yaml
  resources:
    - url: /local/mail-packages-card/Home-Assistant-Mail-And-Packages-Custom-Card.js
      type: module
''')
if args.local:
    yaml = config / "configuration.yaml"
    yaml.write_text(yaml.read_text().replace("http:\n", ""))
    (config / ".spec003-native").touch()
(config / "ui-lovelace.yaml").write_text('''title: SPEC-003
views:
  - title: Packages
    path: packages
    cards:
      - type: custom:mail-and-packages-card
        letters_expanded: true
''')
data = {
    "universal_packages": 1, "zpackages_transit": 4, "zpackages_delivered": 1,
    "universal_tracking_details": [{
        "number": "00340434161094000001", "carrier": "dhl", "status": "OutForDelivery",
        "source": "17track", "last_event": "Out for delivery", "last_location": "Berlin",
        "last_update": "2026-11-07T10:00:00+00:00", "estimated_delivery": "2026-11-07T18:00:00+00:00",
        "history": [{"time": "2026-11-07T10:00:00+00:00", "description": "Out for delivery", "location": "Berlin"}]
    }],
    "amazon_packages": 3, "amazon_delivered": 1, "amazon_hub": 1, "amazon_otp": 3,
    "amazon_order": ["111-2222222-3333333", "222-3333333-4444444", "333-4444444-5555555"],
    "amazon_delivered_orders": ["444-5555555-6666666"],
    "amazon_order_tracking": {
        "111-2222222-3333333": "TBA123456789",
        "222-3333333-4444444": "TBA987654321",
        "333-4444444-5555555": "TBA555555555",
        "444-5555555-6666666": "TBA444444444",
    },
    "amazon_hub_code": ["HUB-77"], "amazon_otp_code": ["654321", "123456", "999888"],
    "amazon_otp_details": [
        {"order": "111-2222222-3333333", "code": "654321"},
        {"order": "222-3333333-4444444", "code": "123456"},
        {"order": "555-6666666-7777777", "code": "999888"},
    ],
    "dhl_brief_anzahl": 1,
    "dhl_brief_letters": [{"id": "spec003", "date": "2026-11-07", "image_path": "/config/www/mail_and_packages/letter.svg"}],
    "packages_history": 0, "packages_history_details": [],
}
(config / "synthetic-data.json").write_text(json.dumps(data, indent=2))
provenance = {**VERSIONS, "card_sha": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()}
(RUNTIME / "provenance.json").write_text(json.dumps(provenance, indent=2))
print("Created fresh disposable config. No companion config/secrets copied.")
