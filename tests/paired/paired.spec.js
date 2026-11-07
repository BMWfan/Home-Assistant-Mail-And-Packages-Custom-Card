import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

// Onboarding happens once in start.py, not separately for each browser project.
const token = () =>
  JSON.parse(readFileSync("tests/paired/runtime/auth.json", "utf8"));

test("real Lovelace and companion platform contract", async ({
  page,
  request,
}, testInfo) => {
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
  // Native HA's first custom bind/port starts a disposable HTTP trial.
  const confirm = page.getByRole("button", { name: "Confirm", exact: true });
  if (await confirm.isVisible()) await confirm.click();
  await expect(card).toContainText("00340434161094000001");
  await expect(card).toContainText("TBA123456789");
  await expect(card).toContainText("654321");
  await expect(card).toContainText("HUB-77");
  await card.locator(".row-meta .meta-link").first().click();
  await expect(card.locator(".timeline").first()).toBeVisible();
  const image = card.locator(".letters-grid img").first();
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute(
    "src",
    /\/local\/mail_and_packages\/letter.svg/,
  );
  expect(await image.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(
    true,
  );
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
  const before = await count();
  await card.locator('button[title="Scan now"]').click();
  await expect.poll(count, { timeout: 30_000 }).toBeGreaterThan(before);
  // Verify discovery came from actual HA's registry rather than injected hass.
  const registry = await page.evaluate(async () => {
    const ha = document.querySelector("home-assistant");
    return ha.hass.callWS({ type: "config/entity_registry/list" });
  });
  expect(
    registry.some(
      (e) =>
        e.platform === "mail_and_packages" && e.entity_id.includes("scan_now"),
    ),
  ).toBe(true);
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
