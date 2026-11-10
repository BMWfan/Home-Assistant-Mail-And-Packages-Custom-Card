import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

// Onboarding happens once in start.py, not separately for each browser project.
const token = () =>
  JSON.parse(readFileSync("tests/paired/runtime/auth.json", "utf8"));

test("real Lovelace and companion platform contract", async ({
  page,
  request,
}, testInfo) => {
  const scanCalls = [];
  page.on("websocket", (socket) => {
    const calls = new Map();
    socket.on("framesent", ({ payload }) => {
      const message = JSON.parse(String(payload));
      if (
        message.type === "call_service" &&
        message.domain === "button" &&
        message.service === "press"
      ) {
        const call = {
          entityId:
            message.service_data?.entity_id ?? message.target?.entity_id,
        };
        calls.set(message.id, call);
        scanCalls.push(call);
      }
    });
    socket.on("framereceived", ({ payload }) => {
      // HA negotiates coalesced messages: one WebSocket frame can contain
      // several JSON responses, rather than a single response object.
      const decoded = JSON.parse(String(payload));
      for (const message of Array.isArray(decoded) ? decoded : [decoded]) {
        if (message.type === "result" && calls.has(message.id))
          calls.get(message.id).success = message.success;
      }
    });
  });
  const errors = [];
  const errorFile = `tests/paired/artifacts/frontend-errors-${testInfo.project.name}.json`;
  const saveErrors = () =>
    writeFileSync(errorFile, JSON.stringify(errors, null, 2));
  saveErrors();
  page.on("pageerror", (error) => {
    errors.push({
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    saveErrors();
  });
  const consoleReads = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleReads.push(
        Promise.all(
          message.args().map((arg) => arg.jsonValue().catch(() => null)),
        ).then((args) => {
          errors.push({
            text: message.text(),
            args,
            location: message.location(),
          });
          saveErrors();
        }),
      );
    }
  });
  const auth = token();
  await page.addInitScript((auth) => {
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled rejection details", event.reason);
    });
    localStorage.setItem("hassTokens", JSON.stringify(auth));
    if (!localStorage.getItem("selectedLanguage"))
      localStorage.setItem("selectedLanguage", JSON.stringify("en"));
  }, auth);
  const headers = { Authorization: `Bearer ${auth.access_token}` };
  await expect
    .poll(
      async () => {
        const response = await request.get("/api/states/sensor.spec003_ready", {
          headers,
        });
        return response.ok() ? (await response.json()).state : "pending";
      },
      { timeout: 120_000 },
    )
    .toBe("ready");
  const ready = await (
    await request.get("/api/states/sensor.spec003_ready", { headers })
  ).json();
  writeFileSync(
    `tests/paired/artifacts/versions-${testInfo.project.name}.json`,
    JSON.stringify(ready.attributes, null, 2),
  );
  await page.goto("/lovelace/packages", { waitUntil: "domcontentloaded" });
  const card = page.locator("mail-and-packages-card");
  await expect(card).toBeVisible();
  await expect(page.locator("#ha-launch-screen")).toBeHidden();
  // A native run must have stable loopback settings with no pending trial.
  const http = await page.evaluate(() =>
    document
      .querySelector("home-assistant")
      .hass.callWS({ type: "http/config" }),
  );
  expect(http.pending).toBeNull();
  expect(http.revert_at).toBeNull();
  if (http.stable.server_port === 18123)
    expect(http.stable.server_host).toEqual(["127.0.0.1"]);
  const rowFor = (tracking) =>
    card
      .locator(".row")
      .filter({ has: page.locator(".row-num", { hasText: tracking }) });
  const firstAmazon = rowFor("TBA123456789");
  const secondAmazon = rowFor("TBA987654321");
  const noOtpAmazon = rowFor("TBA555555555");
  await expect(firstAmazon.locator(".codechip .codebar-code")).toHaveText(
    "654321",
  );
  await expect(secondAmazon.locator(".codechip .codebar-code")).toHaveText(
    "123456",
  );
  await expect(noOtpAmazon).toBeVisible();
  await expect(noOtpAmazon.locator(".codechip")).toHaveCount(0);
  await expect(
    rowFor("TBA444444444").locator(".status.delivered"),
  ).toBeVisible();
  // Orphan OTP remains visible outside shipment rows, distinct from Hub pickup.
  await expect(
    card.locator(".codebar").filter({ hasText: "999888" }),
  ).toBeVisible();
  await expect(card.locator(".row .codebar-code")).toHaveText([
    "654321",
    "123456",
  ]);
  await expect(
    card.locator(".codebar").filter({ hasText: "HUB-77" }),
  ).toBeVisible();
  const dhl = rowFor("00340434161094000001");
  await dhl.locator(".row-meta .meta-link").click();
  await expect(dhl.locator(".timeline")).toBeVisible();
  await expect(dhl.locator(".timeline")).toContainText("Out for delivery");
  await expect(dhl.locator(".timeline")).toContainText("Berlin");
  const image = card.locator(".letters-grid img").first();
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute(
    "src",
    /\/local\/mail_and_packages\/letter.svg/,
  );
  await expect
    .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
    .toBe(true);
  const count = async () =>
    Number(
      (
        await (
          await request.get("/api/states/sensor.spec003_refresh_count", {
            headers,
          })
        ).json()
      ).state,
    );
  const registry = await page.evaluate(async () => {
    const ha = document.querySelector("home-assistant");
    return ha.hass.callWS({ type: "config/entity_registry/list" });
  });
  const scanEntities = registry.filter(
    (e) =>
      e.platform === "mail_and_packages" &&
      e.entity_id.includes("scan_now") &&
      !e.disabled_by,
  );
  expect(scanEntities).toHaveLength(1);
  const before = await count();
  await card.locator('button[title="Scan now"]').click();
  await expect.poll(() => scanCalls.length).toBe(1);
  const target = scanCalls[0].entityId;
  expect(Array.isArray(target) ? target : [target]).toEqual([
    scanEntities[0].entity_id,
  ]);
  await expect.poll(() => scanCalls[0].success, { timeout: 30_000 }).toBe(true);
  await expect.poll(count, { timeout: 30_000 }).toBeGreaterThan(before);
  for (const language of ["de", "en"]) {
    await page.evaluate(
      (language) =>
        localStorage.setItem("selectedLanguage", JSON.stringify(language)),
      language,
    );
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(card).toContainText(
      language === "de" ? "unterwegs" : "in transit",
    );
    await expect(page.locator("#ha-launch-screen")).toBeHidden();
    const rowWidths = await card.locator(".row").evaluateAll((rows) =>
      rows.map((row) => ({
        client: row.clientWidth,
        scroll: row.scrollWidth,
      })),
    );
    for (const width of rowWidths)
      expect(width.scroll).toBeLessThanOrEqual(width.client + 1);
    const documentWidth = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(documentWidth.scroll).toBeLessThanOrEqual(documentWidth.viewport);
    await page.screenshot({
      path: `tests/paired/artifacts/${testInfo.project.name}-${language}.png`,
      fullPage: true,
    });
  }
  const box = await card.boundingBox();
  expect(box.width).toBeLessThanOrEqual(page.viewportSize().width);
  await Promise.all(consoleReads);
  expect(errors).toEqual([]);
});
