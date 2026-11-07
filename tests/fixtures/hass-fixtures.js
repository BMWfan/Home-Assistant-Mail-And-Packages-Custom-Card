const nowIso = () => new Date().toISOString();

export function createHassFixture({ language = "en", includeRegistry = true } = {}) {
  const states = {
    "sensor.mail_updated": { state: nowIso(), attributes: {} },
    "sensor.mail_universal_packages": {
      state: "2",
      attributes: {
        tracking_details: [
          {
            number: "00340434161094000001",
            carrier: "dhl",
            status: "OutForDelivery",
            last_event: "Out for delivery",
            last_location: "Berlin",
            last_update: nowIso(),
            estimated_delivery: nowIso(),
            history: [
              { time: nowIso(), description: "Out for delivery", location: "Berlin" },
              { time: nowIso(), description: "Processed", location: "Leipzig" },
            ],
            source: "17track",
          },
          {
            number: "1Z12345E0205271688",
            carrier: "ups",
            status: "InTransit",
            last_event: "Arrived at facility",
            last_location: "Hamburg",
            last_update: nowIso(),
            estimated_delivery: nowIso(),
            history: [],
            source: "17track",
          },
        ],
      },
    },
    "sensor.mail_packages_in_transit": { state: "1", attributes: {} },
    "sensor.mail_packages_delivered": { state: "1", attributes: {} },
    "sensor.dhl_letter_preview": {
      state: "2",
      attributes: {
        letters: [
          { date: "07.11.2026", image: "/api/image/letter-1.jpg" },
          { date: "08.11.2026", image: "/api/image/letter-2.jpg" },
        ],
      },
    },
    "sensor.mail_amazon_packages": {
      state: "1",
      attributes: {
        domain: "amazon.de",
        order: ["111-2222222-3333333"],
        tracking: { "111-2222222-3333333": "TBA123456789" },
      },
    },
    "sensor.mail_amazon_packages_delivered": {
      state: "1",
      attributes: {
        order: ["111-2222222-3333333"],
        tracking: { "111-2222222-3333333": "TBA123456789" },
      },
    },
    "sensor.mail_amazon_otp_code": {
      state: "1",
      attributes: {
        code: ["654321"],
        details: [{ order: "111-2222222-3333333", code: "654321" }],
      },
    },
    "sensor.mail_amazon_hub_packages": { state: "1", attributes: { code: ["HUB-77"] } },
    "camera.mail_amazon_delivery_camera": {
      state: "idle",
      attributes: { entity_picture: "/api/camera_proxy/camera.mail_amazon_delivery_camera" },
    },
    "camera.dhl_letter_preview": { state: "idle", attributes: { entity_picture: "/api/camera_proxy/camera.dhl_letter_preview" } },
    "button.mail_scan_now": { state: "unknown", attributes: {} },
  };

  const entities = includeRegistry
    ? {
        "sensor.mail_updated": { platform: "mail_and_packages" },
        "sensor.mail_universal_packages": { platform: "mail_and_packages" },
        "sensor.mail_packages_in_transit": { platform: "mail_and_packages" },
        "sensor.mail_packages_delivered": { platform: "mail_and_packages" },
        "sensor.dhl_letter_preview": { platform: "mail_and_packages" },
        "sensor.mail_amazon_packages": { platform: "mail_and_packages" },
        "sensor.mail_amazon_packages_delivered": { platform: "mail_and_packages" },
        "sensor.mail_amazon_otp_code": { platform: "mail_and_packages" },
        "sensor.mail_amazon_hub_packages": { platform: "mail_and_packages" },
        "camera.mail_amazon_delivery_camera": { platform: "mail_and_packages" },
        "camera.dhl_letter_preview": { platform: "mail_and_packages" },
        "button.mail_scan_now": { platform: "mail_and_packages" },
      }
    : {};

  return {
    entities,
    states,
    locale: { language },
    language,
    themes: { darkMode: false },
  };
}

export function createNoDataFixture({ language = "en" } = {}) {
  return {
    entities: {},
    states: {},
    locale: { language },
    language,
    themes: { darkMode: false },
  };
}
