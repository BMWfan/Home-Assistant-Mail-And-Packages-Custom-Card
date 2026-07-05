/* Mail and Packages Card v1.0.0
 * Shipment-list card for the Mail and Packages integration.
 * Entities are discovered automatically from the entity registry
 * (platform "mail_and_packages") - no manual entity config needed.
 */
const LitElement = customElements.get("hui-masonry-view")
  ? Object.getPrototypeOf(customElements.get("hui-masonry-view"))
  : Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const CARD_VERSION = "1.0.0";

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

// ── i18n ─────────────────────────────────────────────────────────────────────
const STRINGS = {
  de: {
    title: "Post & Pakete",
    in_transit: "unterwegs",
    delivered_today: "heute",
    letters: "Briefe",
    letters_today: (n) => (n === 1 ? "1 Brief kommt heute" : `${n} Briefe kommen heute`),
    no_shipments: "Keine Sendungen unterwegs",
    all_quiet: "Alles ruhig – kein Paket, kein Brief.",
    order: "Bestellung",
    otp_label: "Zustellcode für diese Sendung",
    otp_label_generic: "Zustellcode für heutige Amazon-Lieferung",
    hub_label: "Abholstations-Code",
    copy: "Code kopieren",
    copied: "Kopiert!",
    photo_hint: "Fahrerfoto – tippen für Großansicht",
    updated_just_now: "gerade eben",
    updated_min: (n) => `vor ${n} min`,
    updated_h: (n) => `vor ${n} Std.`,
    updated_d: (n) => `vor ${n} Tagen`,
    scan_now: "Jetzt scannen",
    today: "heute",
    tomorrow: "morgen",
    yesterday: "gestern",
    delivered_chip: "Heute zugestellt",
    delay: "Verzögerung gemeldet",
    status: {
      NotFound: "Angekündigt",
      InfoReceived: "Angekündigt",
      InTransit: "Unterwegs",
      AvailableForPickup: "Abholbereit",
      OutForDelivery: "In Zustellung",
      DeliveryFailure: "Zustellung fehlgeschlagen",
      Delivered: "Zugestellt",
      Exception: "Problem",
      Expired: "Abgelaufen",
      unknown: "Angekündigt",
    },
  },
  en: {
    title: "Mail & Packages",
    in_transit: "in transit",
    delivered_today: "today",
    letters: "letters",
    letters_today: (n) => (n === 1 ? "1 letter arriving today" : `${n} letters arriving today`),
    no_shipments: "No shipments in transit",
    all_quiet: "All quiet – no packages, no letters.",
    order: "Order",
    otp_label: "Delivery code for this shipment",
    otp_label_generic: "Delivery code for today's Amazon delivery",
    hub_label: "Pickup location code",
    copy: "Copy code",
    copied: "Copied!",
    photo_hint: "Driver photo – tap to enlarge",
    updated_just_now: "just now",
    updated_min: (n) => `${n} min ago`,
    updated_h: (n) => `${n} h ago`,
    updated_d: (n) => `${n} d ago`,
    scan_now: "Scan now",
    today: "today",
    tomorrow: "tomorrow",
    yesterday: "yesterday",
    delivered_chip: "Delivered today",
    delay: "Delay reported",
    status: {
      NotFound: "Announced",
      InfoReceived: "Announced",
      InTransit: "In transit",
      AvailableForPickup: "Ready for pickup",
      OutForDelivery: "Out for delivery",
      DeliveryFailure: "Delivery failed",
      Delivered: "Delivered",
      Exception: "Problem",
      Expired: "Expired",
      unknown: "Announced",
    },
  },
};

// ── Carrier presentation ─────────────────────────────────────────────────────
const CARRIERS = {
  dhl: { label: "DHL", short: "DHL", bg: "#FFCC00", fg: "#D40511", url: (n) => `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${n}` },
  ups: { label: "UPS", short: "UPS", bg: "#351C15", fg: "#FFB500", url: (n) => `https://www.ups.com/track?tracknum=${n}` },
  usps: { label: "USPS", short: "USPS", bg: "#004B87", fg: "#ffffff", url: (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}` },
  fedex: { label: "FedEx", short: "FDX", bg: "#4D148C", fg: "#FF6600", url: (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}` },
  gls: { label: "GLS", short: "GLS", bg: "#061AB1", fg: "#FFD100", url: (n) => `https://gls-group.com/DE/de/paket-verfolgen?match=${n}` },
  dpd: { label: "DPD", short: "DPD", bg: "#DC0032", fg: "#ffffff", url: (n) => `https://tracking.dpd.de/status/de_DE/parcel/${n}` },
  evri: { label: "Evri/Hermes", short: "HER", bg: "#009BDE", fg: "#ffffff", url: (n) => `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#${n}` },
  hermes: { label: "Hermes", short: "HER", bg: "#009BDE", fg: "#ffffff", url: (n) => `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#${n}` },
  royal_mail: { label: "Royal Mail", short: "RM", bg: "#DA202A", fg: "#FFD100", url: (n) => `https://www.royalmail.com/track-your-item#/tracking-results/${n}` },
  auspost: { label: "AusPost", short: "AUP", bg: "#DC1928", fg: "#ffffff", url: (n) => `https://auspost.com.au/mypost/track/#/details/${n}` },
  post_nl: { label: "PostNL", short: "PNL", bg: "#F56900", fg: "#ffffff", url: (n) => `https://jouw.postnl.nl/track-and-trace/${n}` },
  post_at: { label: "Post AT", short: "PAT", bg: "#FFD100", fg: "#000000", url: (n) => `https://www.post.at/sv/sendungsdetails?snr=${n}` },
  amazon: { label: "Amazon", short: "AMZ", bg: "#FF9900", fg: "#000000", url: () => "https://www.amazon.de/gp/css/order-history/" },
};
const carrierMeta = (key) =>
  CARRIERS[String(key || "").toLowerCase()] || {
    label: String(key || "?").toUpperCase(),
    short: String(key || "?").slice(0, 3).toUpperCase(),
    bg: "var(--secondary-background-color)",
    fg: "var(--primary-text-color)",
    url: (n) => `https://t.17track.net/de#nums=${n}`,
  };

// Status string -> semantic bucket used for chip colors.
const STATUS_KIND = {
  NotFound: "announced",
  InfoReceived: "announced",
  InTransit: "transit",
  AvailableForPickup: "out",
  OutForDelivery: "out",
  DeliveryFailure: "error",
  Delivered: "delivered",
  Exception: "error",
  Expired: "announced",
};

// ── Card ─────────────────────────────────────────────────────────────────────
class MailAndPackagesCard extends LitElement {
  static get properties() {
    return { _config: {}, hass: {}, _lettersOpen: {}, _lightbox: {}, _copied: {} };
  }

  static getConfigElement() {
    return document.createElement("mail-and-packages-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    this._config = config || {};
    this._lettersOpen = Boolean(this._config.letters_expanded);
  }

  // ── discovery ──────────────────────────────────────────────────────────
  _entities() {
    const reg = this.hass.entities || {};
    if (this._entCache && this._entCacheSrc === reg) return this._entCache;
    const found = {};
    for (const id of Object.keys(reg)) {
      if (reg[id].platform !== "mail_and_packages") continue;
      const [domain, oid] = id.split(".");
      if (domain === "button" && oid.includes("scan_now")) found.scan = id;
      else if (domain === "camera" && oid.includes("amazon")) found.amazon_camera = id;
      else if (domain === "camera" && (oid.includes("dhl_letter") || oid.includes("dhl_brief"))) found.dhl_camera = id;
      else if (domain !== "sensor") continue;
      else if (oid.includes("universal_packages")) found.universal = id;
      else if (oid.includes("amazon_otp")) found.otp = id;
      else if (oid.includes("amazon_hub")) found.hub = id;
      else if (oid.includes("amazon_exception")) found.amazon_exception = id;
      else if (oid.includes("amazon_packages_delivered")) found.amazon_delivered = id;
      else if (oid.includes("amazon_packages")) found.amazon = id;
      else if (oid.includes("dhl_letter") || oid.includes("dhl_brief")) found.letters = id;
      else if (oid.includes("packages_delivered")) found.delivered = id;
      else if (oid.includes("packages_in_transit")) found.transit = id;
      else if (oid.includes("mail_updated")) found.updated = id;
    }
    // Fallback for setups where the entity registry is not exposed.
    if (!found.updated && this.hass.states["sensor.mail_updated"]) {
      found.updated = "sensor.mail_updated";
      const guess = {
        universal: "sensor.mail_universal_packages",
        transit: "sensor.mail_packages_in_transit",
        delivered: "sensor.mail_packages_delivered",
        letters: "sensor.dhl_letter_preview",
        amazon: "sensor.mail_amazon_packages",
        amazon_delivered: "sensor.mail_amazon_packages_delivered",
        otp: "sensor.mail_amazon_otp_code",
        hub: "sensor.mail_amazon_hub_packages",
        amazon_camera: "camera.mail_amazon_delivery_camera",
        dhl_camera: "camera.dhl_letter_preview",
      };
      for (const [k, v] of Object.entries(guess)) if (this.hass.states[v]) found[k] = v;
    }
    // Explicit config overrides always win.
    for (const k of ["updated", "universal", "transit", "delivered", "letters", "amazon", "amazon_delivered", "otp", "hub", "scan", "amazon_camera", "dhl_camera"]) {
      if (this._config[k]) found[k] = this._config[k];
    }
    this._entCache = found;
    this._entCacheSrc = reg;
    return found;
  }

  _t() {
    const lang = (this.hass && (this.hass.locale?.language || this.hass.language)) || "en";
    return lang.startsWith("de") ? STRINGS.de : STRINGS.en;
  }

  _st(id) {
    return id ? this.hass.states[id] : undefined;
  }

  _num(id) {
    const s = this._st(id);
    const n = parseInt(s ? s.state : "0", 10);
    return Number.isFinite(n) ? n : 0;
  }

  _relTime(iso) {
    const t = this._t();
    const then = new Date(iso);
    if (Number.isNaN(then.getTime())) return "";
    const mins = Math.max(0, Math.round((Date.now() - then.getTime()) / 60000));
    if (mins < 1) return t.updated_just_now;
    if (mins < 60) return t.updated_min(mins);
    if (mins < 48 * 60) return t.updated_h(Math.round(mins / 60));
    return t.updated_d(Math.round(mins / 1440));
  }

  _letterDate(raw) {
    const t = this._t();
    if (!raw) return "";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);
    const today = new Date();
    const diff = Math.round((d.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / 86400000);
    if (diff === 0) return t.today;
    if (diff === 1) return t.tomorrow;
    if (diff === -1) return t.yesterday;
    return new Date(raw).toLocaleDateString(this.hass.locale?.language || "de", { day: "numeric", month: "short" });
  }

  // ── actions ────────────────────────────────────────────────────────────
  _moreInfo(entityId) {
    if (entityId) fireEvent(this, "hass-more-info", { entityId });
  }

  _scan(ev) {
    ev.stopPropagation();
    const ents = this._entities();
    if (!ents.scan) return;
    const icon = ev.currentTarget.querySelector("ha-icon");
    if (icon) {
      icon.classList.add("spin");
      setTimeout(() => icon.classList.remove("spin"), 2500);
    }
    this.hass.callService("button", "press", { entity_id: ents.scan });
  }

  _copyCode(ev, code) {
    ev.stopPropagation();
    if (navigator.clipboard) navigator.clipboard.writeText(code);
    this._copied = code;
    setTimeout(() => {
      this._copied = null;
    }, 1600);
  }

  _openLightbox(ev, src) {
    ev.stopPropagation();
    this._lightbox = src;
  }

  // ── data assembly ──────────────────────────────────────────────────────
  _shipments(ents, t) {
    const rows = [];
    const uni = this._st(ents.universal);
    const details = (uni && uni.attributes.tracking_details) || [];
    for (const d of details) {
      const meta = carrierMeta(d.carrier);
      const statusKey = d.status && STATUS_KIND[d.status] ? d.status : "unknown";
      rows.push({
        key: `u-${d.number}`,
        badge: meta,
        title: meta.label,
        statusText: t.status[statusKey] || t.status.unknown,
        kind: STATUS_KIND[d.status] || "announced",
        event: d.last_event || "",
        location: d.last_location || "",
        time: d.last_update ? this._relTime(d.last_update) : "",
        number: d.number,
        url: meta.url(d.number),
      });
    }

    // Amazon: arriving orders + optional per-order delivery code.
    const amazon = this._st(ents.amazon);
    const otp = this._st(ents.otp);
    const otpDetails = (otp && otp.attributes.details) || [];
    const otpCodes = (otp && otp.attributes.code) || [];
    let orders = (amazon && amazon.attributes.order) || [];
    if (!Array.isArray(orders)) orders = [orders].filter(Boolean);
    const matchedCodes = new Set();
    for (const order of orders) {
      const match = otpDetails.find((d) => d && d.order === order && d.code);
      if (match) matchedCodes.add(match.code);
      const meta = carrierMeta("amazon");
      rows.push({
        key: `a-${order}`,
        badge: meta,
        title: "Amazon",
        statusText: t.status.InTransit,
        kind: "transit",
        event: `${t.order} ${order}`,
        location: "",
        time: "",
        number: null,
        url: meta.url(),
        code: match ? match.code : null,
      });
    }
    // Codes we could not match to an order still need to be visible.
    const unmatched = [];
    for (const d of otpDetails) {
      if (d && d.code && !matchedCodes.has(d.code)) unmatched.push(d.code);
    }
    if (!otpDetails.length) for (const c of otpCodes) unmatched.push(c);

    // Amazon delivered today (+ driver photo).
    const deliveredCount = this._num(ents.amazon_delivered);
    if (deliveredCount > 0) {
      const cam = this._st(ents.amazon_camera);
      const meta = carrierMeta("amazon");
      rows.push({
        key: "a-delivered",
        badge: { ...meta, short: "✓", bg: "var(--success-color, #4caf50)", fg: "#fff" },
        title: "Amazon",
        statusText: t.delivered_chip,
        kind: "delivered",
        event: deliveredCount === 1 ? "" : `${deliveredCount}×`,
        location: "",
        time: "",
        number: null,
        url: meta.url(),
        photo: cam && cam.attributes.entity_picture ? cam.attributes.entity_picture : null,
        photoEntity: ents.amazon_camera,
      });
    }
    return { rows, unmatched };
  }

  // ── render ─────────────────────────────────────────────────────────────
  render() {
    if (!this._config || !this.hass) return html``;
    const t = this._t();
    const ents = this._entities();

    if (!ents.updated) {
      return html`<ha-card>
        <div class="warn">Mail and Packages integration not found. Configure it first, or set entity overrides in the card config.</div>
      </ha-card>`;
    }

    const cfg = this._config;
    const showChips = cfg.show_summary !== false;
    const showShipments = cfg.show_shipments !== false;
    const showLetters = cfg.show_letters !== false;

    const updatedState = this._st(ents.updated);
    const transit = this._num(ents.transit);
    const delivered = this._num(ents.delivered);
    const lettersState = this._st(ents.letters);
    const letters = (lettersState && lettersState.attributes.letters) || [];
    const letterCount = letters.length || this._num(ents.letters);

    const { rows, unmatched } = this._shipments(ents, t);
    const hub = this._st(ents.hub);
    const hubCodes = (hub && hub.attributes.code) || [];

    const empty = !rows.length && !letterCount && !unmatched.length && !hubCodes.length;

    return html`
      <ha-card>
        <div class="header" @click=${() => this._moreInfo(ents.updated)}>
          <div class="header-left">
            <ha-icon icon="mdi:mailbox-outline"></ha-icon>
            <span class="title">${cfg.name || t.title}</span>
          </div>
          <div class="header-right">
            ${updatedState ? html`<span class="updated">${this._relTime(updatedState.state)}</span>` : ""}
            ${ents.scan
              ? html`<button class="iconbtn" title="${t.scan_now}" @click=${(e) => this._scan(e)}>
                  <ha-icon icon="mdi:refresh"></ha-icon>
                </button>`
              : ""}
          </div>
        </div>

        ${unmatched.map(
          (code) => html`
            <div class="codebar" @click=${(e) => this._copyCode(e, code)}>
              <ha-icon icon="mdi:key-variant"></ha-icon>
              <div class="codebar-text">
                <span class="codebar-label">${t.otp_label_generic}</span>
                <span class="codebar-code">${code}</span>
              </div>
              <span class="copyhint">${this._copied === code ? t.copied : ""}</span>
              <ha-icon icon="mdi:content-copy" class="copyicon"></ha-icon>
            </div>
          `
        )}
        ${hubCodes.map(
          (code) => html`
            <div class="codebar" @click=${(e) => this._copyCode(e, code)}>
              <ha-icon icon="mdi:locker"></ha-icon>
              <div class="codebar-text">
                <span class="codebar-label">${t.hub_label}</span>
                <span class="codebar-code">${code}</span>
              </div>
              <span class="copyhint">${this._copied === code ? t.copied : ""}</span>
              <ha-icon icon="mdi:content-copy" class="copyicon"></ha-icon>
            </div>
          `
        )}

        ${showChips && !empty
          ? html`
              <div class="chips">
                ${transit > 0
                  ? html`<span class="chip transit" @click=${() => this._moreInfo(ents.transit)}>
                      <ha-icon icon="mdi:truck-delivery-outline"></ha-icon>${transit} ${t.in_transit}
                    </span>`
                  : ""}
                ${delivered > 0
                  ? html`<span class="chip delivered" @click=${() => this._moreInfo(ents.delivered)}>
                      <ha-icon icon="mdi:package-variant-closed-check"></ha-icon>${delivered} ${t.delivered_today}
                    </span>`
                  : ""}
                ${letterCount > 0
                  ? html`<span class="chip letters" @click=${() => this._moreInfo(ents.letters)}>
                      <ha-icon icon="mdi:email-outline"></ha-icon>${letterCount} ${t.letters}
                    </span>`
                  : ""}
              </div>
            `
          : ""}

        ${showShipments
          ? html`
              <div class="list">
                ${rows.map((r) => this._renderRow(r, t))}
                ${empty
                  ? html`<div class="empty">
                      <ha-icon icon="mdi:mailbox-open-outline"></ha-icon>
                      <span>${t.no_shipments}</span>
                      <span class="empty-sub">${t.all_quiet}</span>
                    </div>`
                  : ""}
              </div>
            `
          : ""}

        ${showLetters && letterCount > 0 ? this._renderLetters(letters, letterCount, ents, t) : ""}

        ${this._lightbox
          ? html`<div class="lightbox" @click=${() => (this._lightbox = null)}>
              <img src="${this._lightbox}" />
            </div>`
          : ""}
      </ha-card>
    `;
  }

  _renderRow(r, t) {
    const clickable = Boolean(r.url);
    return html`
      <div class="row">
        <div
          class="badge"
          style="background:${r.badge.bg};color:${r.badge.fg}"
          @click=${clickable ? () => window.open(r.url, "_blank") : undefined}
        >
          ${r.badge.short}
        </div>
        <div class="row-body">
          <div class="row-top" @click=${clickable ? () => window.open(r.url, "_blank") : undefined}>
            <span class="row-title">${r.title}</span>
            <span class="status ${r.kind}">${r.statusText}</span>
          </div>
          ${r.event ? html`<div class="row-event">${r.event}</div>` : ""}
          ${r.location || r.time || r.number
            ? html`<div class="row-meta">
                ${r.location ? html`<ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${r.location}</span>` : ""}
                ${r.time ? html`<span>${r.time}</span>` : ""}
                ${r.number ? html`<span class="mono">…${String(r.number).slice(-10)}</span>` : ""}
              </div>`
            : ""}
          ${r.code
            ? html`<div class="codechip" @click=${(e) => this._copyCode(e, r.code)}>
                <ha-icon icon="mdi:key-variant"></ha-icon>
                <div class="codebar-text">
                  <span class="codebar-label">${t.otp_label}</span>
                  <span class="codebar-code">${r.code}</span>
                </div>
                <span class="copyhint">${this._copied === r.code ? t.copied : ""}</span>
                <ha-icon icon="mdi:content-copy" class="copyicon"></ha-icon>
              </div>`
            : ""}
          ${r.photo
            ? html`<div class="photorow">
                <img class="thumb" src="${r.photo}" @click=${(e) => this._openLightbox(e, r.photo)} />
                <span class="photohint">${t.photo_hint}</span>
              </div>`
            : ""}
        </div>
      </div>
    `;
  }

  _renderLetters(letters, count, ents, t) {
    const withImages = letters.filter((l) => l && l.image);
    const expandable = withImages.length > 0 || Boolean(ents.dhl_camera);
    return html`
      <div class="letters">
        <div
          class="letters-head"
          @click=${() => {
            if (expandable) this._lettersOpen = !this._lettersOpen;
            else this._moreInfo(ents.letters);
          }}
        >
          <ha-icon icon="mdi:email-outline"></ha-icon>
          <span class="letters-title">${t.letters_today(count)}</span>
          ${expandable ? html`<ha-icon class="chev" icon="${this._lettersOpen ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon>` : ""}
        </div>
        ${this._lettersOpen && expandable
          ? html`<div class="letters-grid">
              ${withImages.length
                ? withImages.map(
                    (l) => html`
                      <div class="letter">
                        <img src="${l.image}" @click=${(e) => this._openLightbox(e, l.image)} />
                        <span>${this._letterDate(l.date)}</span>
                      </div>
                    `
                  )
                : html`<div class="letter wide" @click=${() => this._moreInfo(ents.dhl_camera)}>
                    <ha-icon icon="mdi:image-outline"></ha-icon>
                  </div>`}
            </div>`
          : ""}
      </div>
    `;
  }

  getCardSize() {
    return 3;
  }

  static get styles() {
    return css`
      ha-card {
        overflow: hidden;
      }
      .warn {
        padding: 14px 16px;
        color: var(--warning-color, #ff9800);
        font-size: 0.9em;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px 8px;
        cursor: pointer;
      }
      .header-left {
        display: flex;
        align-items: center;
        gap: 9px;
        min-width: 0;
      }
      .header-left ha-icon {
        color: var(--primary-color);
      }
      .title {
        font-size: 1.05em;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .header-right {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .updated {
        font-size: 0.72em;
        color: var(--secondary-text-color);
      }
      .iconbtn {
        background: none;
        border: none;
        padding: 4px;
        margin: -4px 0;
        cursor: pointer;
        color: var(--secondary-text-color);
        display: flex;
        border-radius: 50%;
      }
      .iconbtn:hover {
        background: var(--secondary-background-color);
      }
      .iconbtn ha-icon.spin {
        animation: spin 1.2s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .codebar,
      .codechip {
        display: flex;
        align-items: center;
        gap: 10px;
        background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
        border-radius: 10px;
        padding: 8px 12px;
        cursor: pointer;
        color: var(--warning-color, #b26a00);
      }
      .codebar {
        margin: 4px 16px 6px;
      }
      .codechip {
        margin-top: 8px;
      }
      .codebar-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .codebar-label {
        font-size: 0.7em;
      }
      .codebar-code {
        font-size: 1.25em;
        font-weight: 600;
        letter-spacing: 3px;
        font-family: var(--code-font-family, monospace);
        color: var(--primary-text-color);
      }
      .copyhint {
        font-size: 0.7em;
      }
      .copyicon {
        --mdc-icon-size: 16px;
        flex-shrink: 0;
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 2px 16px 10px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.78em;
        padding: 3px 11px;
        border-radius: 20px;
        cursor: pointer;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }
      .chip ha-icon {
        --mdc-icon-size: 15px;
      }
      .chip.transit {
        background: color-mix(in srgb, var(--info-color, #039be5) 14%, transparent);
        color: var(--info-color, #0277bd);
      }
      .chip.delivered {
        background: color-mix(in srgb, var(--success-color, #4caf50) 14%, transparent);
        color: var(--success-color, #2e7d32);
      }

      .list {
        padding: 0 16px 6px;
      }
      .row {
        display: flex;
        gap: 12px;
        padding: 10px 0;
        border-top: 1px solid var(--divider-color);
      }
      .row:first-child {
        border-top: none;
      }
      .badge {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.68em;
        font-weight: 700;
        flex-shrink: 0;
        cursor: pointer;
        user-select: none;
      }
      .row-body {
        flex: 1;
        min-width: 0;
      }
      .row-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
      .row-title {
        font-size: 0.88em;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .status {
        font-size: 0.7em;
        padding: 2px 9px;
        border-radius: 10px;
        white-space: nowrap;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }
      .status.transit {
        background: color-mix(in srgb, var(--info-color, #039be5) 14%, transparent);
        color: var(--info-color, #0277bd);
      }
      .status.out {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 16%, transparent);
        color: var(--warning-color, #b26a00);
      }
      .status.delivered {
        background: color-mix(in srgb, var(--success-color, #4caf50) 14%, transparent);
        color: var(--success-color, #2e7d32);
      }
      .status.error {
        background: color-mix(in srgb, var(--error-color, #f44336) 14%, transparent);
        color: var(--error-color, #c62828);
      }
      .row-event {
        font-size: 0.78em;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }
      .row-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.7em;
        color: var(--secondary-text-color);
        opacity: 0.8;
        margin-top: 2px;
      }
      .row-meta ha-icon {
        --mdc-icon-size: 12px;
      }
      .mono {
        font-family: var(--code-font-family, monospace);
      }

      .photorow {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 7px;
      }
      .thumb {
        width: 76px;
        height: 50px;
        object-fit: cover;
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid var(--divider-color);
      }
      .photohint {
        font-size: 0.7em;
        color: var(--secondary-text-color);
      }

      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 20px 0 22px;
        color: var(--secondary-text-color);
      }
      .empty ha-icon {
        --mdc-icon-size: 30px;
        opacity: 0.5;
        margin-bottom: 4px;
      }
      .empty span {
        font-size: 0.85em;
      }
      .empty-sub {
        font-size: 0.72em !important;
        opacity: 0.7;
      }

      .letters {
        border-top: 1px solid var(--divider-color);
        background: var(--secondary-background-color);
      }
      .letters-head {
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 10px 16px;
        cursor: pointer;
      }
      .letters-head ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }
      .letters-title {
        flex: 1;
        font-size: 0.85em;
        color: var(--primary-text-color);
      }
      .chev {
        flex-shrink: 0;
      }
      .letters-grid {
        display: flex;
        gap: 8px;
        padding: 0 16px 12px;
        flex-wrap: wrap;
      }
      .letter {
        flex: 1;
        min-width: 90px;
        max-width: 140px;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .letter img {
        width: 100%;
        aspect-ratio: 3/2;
        object-fit: cover;
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
      }
      .letter span {
        font-size: 0.65em;
        color: var(--secondary-text-color);
        text-align: center;
      }
      .letter.wide {
        max-width: none;
        align-items: center;
        justify-content: center;
        aspect-ratio: 5/2;
        border: 1px dashed var(--divider-color);
        border-radius: 6px;
        cursor: pointer;
      }

      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .lightbox img {
        max-width: 92vw;
        max-height: 88vh;
        border-radius: 8px;
      }
    `;
  }
}
customElements.define("mail-and-packages-card", MailAndPackagesCard);

// ── Editor ───────────────────────────────────────────────────────────────────
class MailAndPackagesCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }

  setConfig(config) {
    this._config = config || {};
  }

  _set(key, value) {
    if (!this._config) return;
    const cfg = { ...this._config };
    if (value === "" || value === undefined || value === null) delete cfg[key];
    else cfg[key] = value;
    this._config = cfg;
    fireEvent(this, "config-changed", { config: cfg });
  }

  _toggle(label, key) {
    return html`
      <div class="switch-row">
        <ha-switch .checked=${this._config[key] !== false} @change=${(e) => this._set(key, e.target.checked ? undefined : false)}></ha-switch>
        <span>${label}</span>
      </div>
    `;
  }

  render() {
    if (!this.hass || !this._config) return html``;
    const de = (this.hass.locale?.language || "en").startsWith("de");
    return html`
      <div class="editor">
        <ha-textfield
          .label=${de ? "Name (optional)" : "Name (optional)"}
          .value=${this._config.name || ""}
          @input=${(e) => this._set("name", e.target.value)}
        ></ha-textfield>
        <p class="hint">
          ${de
            ? "Alle Entities werden automatisch erkannt – keine weitere Konfiguration nötig."
            : "All entities are discovered automatically – no further configuration needed."}
        </p>
        ${this._toggle(de ? "Zusammenfassungs-Chips" : "Summary chips", "show_summary")}
        ${this._toggle(de ? "Sendungsliste" : "Shipment list", "show_shipments")}
        ${this._toggle(de ? "Briefe" : "Letters", "show_letters")}
        <div class="switch-row">
          <ha-switch
            .checked=${this._config.letters_expanded === true}
            @change=${(e) => this._set("letters_expanded", e.target.checked ? true : undefined)}
          ></ha-switch>
          <span>${de ? "Briefe standardmäßig aufgeklappt" : "Letters expanded by default"}</span>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .editor {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      ha-textfield {
        display: block;
      }
      .hint {
        font-size: 0.8em;
        color: var(--secondary-text-color);
        margin: 6px 0 8px;
      }
      .switch-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 0;
      }
      .switch-row span {
        font-size: 0.9em;
        color: var(--primary-text-color);
      }
    `;
  }
}
customElements.define("mail-and-packages-card-editor", MailAndPackagesCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "mail-and-packages-card",
  name: "Mail and Packages",
  description: "Shipment list with delivery codes, driver photos and letter previews. Zero-config entity discovery.",
  preview: false,
});

console.info(
  `%c MAIL-AND-PACKAGES-CARD %c v${CARD_VERSION} `,
  "color: #fff; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: #fff; font-weight: 700;"
);
