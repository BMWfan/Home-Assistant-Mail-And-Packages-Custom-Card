import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createHassFixture,
  createNoDataFixture,
} from "../fixtures/hass-fixtures.js";

const Card = () => customElements.get("mail-and-packages-card");

function createCard(hass, config = {}) {
  const card = new (Card())();
  card.setConfig(config);
  card.hass = hass;
  return card;
}

describe("mail-and-packages-card contract", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("discovers integration entities from the registry", () => {
    const hass = createHassFixture();
    const card = createCard(hass);
    const entities = card._entities();

    expect(entities.updated).toBe("sensor.mail_updated");
    expect(entities.universal).toBe("sensor.mail_universal_packages");
    expect(entities.otp).toBe("sensor.mail_amazon_otp_code");
    expect(entities.hub).toBe("sensor.mail_amazon_hub_packages");
    expect(entities.scan).toBe("button.mail_scan_now");
  });

  it("falls back to default entity ids when registry is unavailable", () => {
    const hass = createHassFixture({ includeRegistry: false });
    const card = createCard(hass);
    const entities = card._entities();

    expect(entities.updated).toBe("sensor.mail_updated");
    expect(entities.universal).toBe("sensor.mail_universal_packages");
    expect(entities.amazon_camera).toBe("camera.mail_amazon_delivery_camera");
  });

  it("builds shipment rows with universal tracking, Amazon OTP and driver image URLs", () => {
    const hass = createHassFixture();
    const card = createCard(hass);
    const t = card._t();
    const { rows, unmatched } = card._shipments(card._entities(), t);

    expect(rows.some((row) => row.number === "00340434161094000001")).toBe(
      true,
    );
    expect(rows.some((row) => row.code === "654321")).toBe(true);
    expect(
      rows.some(
        (row) =>
          row.photo === "/api/camera_proxy/camera.mail_amazon_delivery_camera",
      ),
    ).toBe(true);
    expect(unmatched).toEqual([]);
  });

  it("renders scan controls, code bars, and letter preview images", async () => {
    const hass = createHassFixture();
    const card = createCard(hass, { letters_expanded: true });
    document.body.append(card);
    await card.updateComplete;

    const root = card.shadowRoot;
    expect(
      root.querySelector("button.iconbtn[title='Scan now']"),
    ).not.toBeNull();
    expect(root.textContent).toContain("654321");
    expect(root.textContent).toContain("HUB-77");
    expect(
      root.querySelector(
        ".letters-grid .letter img[src='/local/mail_and_packages/letter-1.jpg']",
      ),
    ).not.toBeNull();
  });

  it("renders localized labels for EN and DE", async () => {
    const hassEn = createHassFixture({ language: "en" });
    const cardEn = createCard(hassEn);
    document.body.append(cardEn);
    await cardEn.updateComplete;

    expect(cardEn.shadowRoot.textContent).toContain("in transit");

    const hassDe = createHassFixture({ language: "de" });
    const cardDe = createCard(hassDe);
    document.body.append(cardDe);
    await cardDe.updateComplete;

    expect(cardDe.shadowRoot.textContent).toContain("unterwegs");
  });

  it("uses Home Assistant theme variables in styles", () => {
    const card = createCard(createNoDataFixture());
    const styleText = card.constructor.styles.cssText;

    expect(styleText).toContain("var(--primary-text-color)");
    expect(styleText).toContain("var(--secondary-background-color)");
  });

  it("triggers scan service calls through Home Assistant API", () => {
    const hass = createHassFixture();
    hass.callService = vi.fn();
    const card = createCard(hass);

    card._scan({
      stopPropagation() {},
      currentTarget: { querySelector: () => null },
    });

    expect(hass.callService).toHaveBeenCalledWith("button", "press", {
      entity_id: "button.mail_scan_now",
    });
  });
});
