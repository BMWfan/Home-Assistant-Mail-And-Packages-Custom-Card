import { expect, test } from "@playwright/test";
import {
  createHassFixture,
  createNoDataFixture,
} from "../fixtures/hass-fixtures.js";

test.beforeEach(async ({ page }) => {
  await page.goto("/tests/smoke/harness.html");
  await page.waitForFunction(() => typeof window.mountCard === "function");
});

test("renders shipment rows and shipment details timeline", async ({
  page,
}) => {
  const fixture = createHassFixture({ language: "en" });

  await page.evaluate(
    async ({ fixture }) => {
      await window.mountCard(fixture, {});
    },
    { fixture },
  );

  await expect(page.locator("#app")).toContainText("Amazon");
  await expect(page.locator("#app")).toContainText("TBA123456789");

  await page.locator(".row-meta .meta-link").first().click();
  await expect(page.locator("#app .timeline")).toBeVisible();
});

test("renders empty and integration-missing states", async ({ page }) => {
  const emptyFixture = createHassFixture({ language: "en" });
  emptyFixture.states[
    "sensor.mail_universal_packages"
  ].attributes.tracking_details = [];
  emptyFixture.states["sensor.mail_packages_in_transit"].state = "0";
  emptyFixture.states["sensor.mail_packages_delivered"].state = "0";
  emptyFixture.states["sensor.dhl_letter_preview"].state = "0";
  emptyFixture.states["sensor.dhl_letter_preview"].attributes.letters = [];
  emptyFixture.states["sensor.mail_amazon_packages"].attributes.order = [];
  emptyFixture.states["sensor.mail_amazon_packages_delivered"].state = "0";
  emptyFixture.states[
    "sensor.mail_amazon_packages_delivered"
  ].attributes.order = [];
  emptyFixture.states[
    "sensor.mail_amazon_packages_delivered"
  ].attributes.tracking = {};
  emptyFixture.states["sensor.mail_amazon_hub_packages"].attributes.code = [];
  emptyFixture.states["sensor.mail_amazon_otp_code"].attributes.code = [];
  emptyFixture.states["sensor.mail_amazon_otp_code"].attributes.details = [];

  await page.evaluate(
    async ({ fixture }) => {
      await window.mountCard(fixture, {});
    },
    { fixture: emptyFixture },
  );

  await expect(page.locator("#app")).toContainText("No shipments in transit");

  const missingFixture = createNoDataFixture({ language: "en" });
  await page.evaluate(
    async ({ fixture }) => {
      await window.mountCard(fixture, {});
    },
    { fixture: missingFixture },
  );

  await expect(page.locator("#app .warn")).toContainText(
    "Mail and Packages integration not found",
  );
});

test("renders DE language labels and mobile viewport", async ({
  page,
  isMobile,
}) => {
  const fixture = createHassFixture({ language: "de" });

  await page.evaluate(
    async ({ fixture }) => {
      await window.mountCard(fixture, { letters_expanded: true });
    },
    { fixture },
  );

  await expect(page.locator("#app")).toContainText("unterwegs");
  await expect(
    page.locator("#app .letters-grid .letter img").first(),
  ).toBeVisible();

  if (isMobile) {
    await expect(page.locator("#app ha-card")).toBeVisible();
  }
});

test("scan control invokes mocked Home Assistant service", async ({ page }) => {
  const fixture = createHassFixture({ language: "en" });

  await page.evaluate(
    async ({ fixture }) => {
      await window.mountCard(fixture, {});
    },
    { fixture },
  );

  await page.locator('button[title="Scan now"]').click();

  const calls = await page.evaluate(() => window.__serviceCalls);
  expect(
    calls.some((call) => call[0] === "button" && call[1] === "press"),
  ).toBeTruthy();
});
