"""Wait for disposable HA and onboard a generated test-only user via local API."""
import json
from pathlib import Path
import secrets
import time
import urllib.parse
import urllib.error
import urllib.request

BASE = "http://127.0.0.1:18123"

def call(path, data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    request = urllib.request.Request(BASE + path, data=json.dumps(data).encode() if data is not None else None, headers=headers)
    with urllib.request.urlopen(request, timeout=10) as response:
        return json.load(response)

for attempt in range(120):
    try:
        steps = call("/api/onboarding")
        break
    except (urllib.error.URLError, TimeoutError):
        time.sleep(2)
else:
    raise RuntimeError("Disposable HA did not start within 240s")
result = call("/api/onboarding/users", {"client_id": BASE + "/", "name": "SPEC003", "username": "spec003", "password": secrets.token_urlsafe(32), "language": "en"})
body = urllib.parse.urlencode({"grant_type": "authorization_code", "code": result["auth_code"], "client_id": BASE + "/"}).encode()
with urllib.request.urlopen(urllib.request.Request(BASE + "/auth/token", data=body), timeout=10) as response:
    auth = json.load(response)
for step, data in [("core_config", {"location_name": "SPEC003", "latitude": 0, "longitude": 0, "elevation": 0, "unit_system": "metric", "time_zone": "UTC"}), ("analytics", {}), ("integration", {"client_id": BASE + "/", "redirect_uri": BASE + "/"})]:
    if any(item["step"] == step and not item["done"] for item in steps):
        call("/api/onboarding/" + step, data, auth["access_token"])
auth.update({"hassUrl": BASE, "clientId": BASE + "/", "expires": int(time.time() * 1000) + auth["expires_in"] * 1000})
path = Path(__file__).resolve().parent / "runtime/auth.json"
path.write_text(json.dumps(auth))
path.chmod(0o600)
print("Disposable owner onboarded; credentials remain in ignored runtime directory.")
