const LitElement = customElements.get("hui-masonry-view")
  ? Object.getPrototypeOf(customElements.get("hui-masonry-view"))
  : Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css  = LitElement.prototype.css;

const fireEvent = (node, type, detail, options) => {
    options = options || {};
    detail  = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
        bubbles:     options.bubbles   === undefined ? true : options.bubbles,
        cancelable:  Boolean(options.cancelable),
        composed:    options.composed  === undefined ? true : options.composed
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
};

// ── Editor ────────────────────────────────────────────────────────────────────
class MailAndPackagesCardEditor extends LitElement {

    static get properties() { return { hass: {}, _config: {} }; }

    setConfig(config) { this._config = config; }

    get _name()               { return this._config.name || ""; }
    get _updated()            { return this._config.updated || ""; }
    get _deliveries_message() { return this._config.deliveries_message || ""; }
    get _packages_delivered() { return this._config.packages_delivered || ""; }
    get _packages_in_transit(){ return this._config.packages_in_transit || ""; }
    get _usps_mail()          { return this._config.usps_mail || ""; }
    get _usps_packages()      { return this._config.usps_packages || ""; }
    get _ups_packages()       { return this._config.ups_packages || ""; }
    get _fedex_packages()     { return this._config.fedex_packages || ""; }
    get _amazon_packages()    { return this._config.amazon_packages || ""; }
    get _dhl_packages()       { return this._config.dhl_packages || ""; }
    get _dpd_packages()       { return this._config.dpd_packages || ""; }
    get _gls_packages()       { return this._config.gls_packages || ""; }
    get _hermes_packages()    { return this._config.hermes_packages || ""; }
    get _gif_sensor()         { return this._config.gif_sensor || ""; }
    get _camera_entity()      { return this._config.camera_entity || ""; }

    get _show_summary()  { return this._config.show_summary  !== false; }
    get _show_message()  { return this._config.show_message  !== false; }
    get _show_carriers() { return this._config.show_carriers !== false; }
    get _show_media()    { return this._config.show_media    !== false; }

    _picker(label, configValue, value, domain = "sensor") {
        return html`
            <ha-selector
                .label="${label}"
                .hass="${this.hass}"
                .value="${value || ""}"
                .selector="${{ entity: { domain } }}"
                @value-changed="${(ev) => this._selectorChanged(configValue, ev.detail.value)}"
            ></ha-selector>`;
    }

    _toggle(label, configValue, checked) {
        return html`
            <div class="switch-row">
                <ha-switch
                    .checked="${checked}"
                    .configValue="${configValue}"
                    @change="${this._valueChanged}"
                ></ha-switch>
                <span>${label}</span>
            </div>`;
    }

    _selectorChanged(configValue, value) {
        if (!this._config || !this.hass) return;
        this._config = (value === "" || value == null)
            ? (({ [configValue]: _, ...rest }) => rest)(this._config)
            : { ...this._config, [configValue]: value };
        fireEvent(this, "config-changed", { config: this._config });
    }

    _valueChanged(ev) {
        if (!this._config || !this.hass) return;
        const target = ev.target;
        const value  = target.checked !== undefined ? target.checked : target.value;
        if (target.configValue) {
            this._config = (value === "")
                ? (({ [target.configValue]: _, ...rest }) => rest)(this._config)
                : { ...this._config, [target.configValue]: value };
        }
        fireEvent(this, "config-changed", { config: this._config });
    }

    render() {
        if (!this.hass) return html``;
        return html`
            <div class="card-config">
                <paper-input
                    label="Name (optional)"
                    .value="${this._name}"
                    .configValue="${"name"}"
                    @value-changed="${this._valueChanged}"
                ></paper-input>

                <div class="section-label">Allgemein</div>
                ${this._picker("Mail Updated Sensor *", "updated", this._updated)}

                <div class="section-label">Modul: Zusammenfassung</div>
                ${this._toggle("Zusammenfassung anzeigen", "show_summary", this._show_summary)}
                ${this._picker("Packages Delivered", "packages_delivered", this._packages_delivered)}
                ${this._picker("Packages In Transit", "packages_in_transit", this._packages_in_transit)}

                <div class="section-label">Modul: Nachricht</div>
                ${this._toggle("Nachricht anzeigen", "show_message", this._show_message)}
                ${this._picker("Delivery Message", "deliveries_message", this._deliveries_message)}

                <div class="section-label">Modul: Carrier</div>
                ${this._toggle("Carrier anzeigen", "show_carriers", this._show_carriers)}
                ${this._picker("USPS Mail", "usps_mail", this._usps_mail)}
                ${this._picker("USPS Packages", "usps_packages", this._usps_packages)}
                ${this._picker("UPS Packages", "ups_packages", this._ups_packages)}
                ${this._picker("FedEx Packages", "fedex_packages", this._fedex_packages)}
                ${this._picker("Amazon Packages", "amazon_packages", this._amazon_packages)}
                ${this._picker("DHL Packages", "dhl_packages", this._dhl_packages)}
                ${this._picker("DPD Packages", "dpd_packages", this._dpd_packages)}
                ${this._picker("GLS Packages", "gls_packages", this._gls_packages)}
                ${this._picker("Hermes Packages", "hermes_packages", this._hermes_packages)}

                <div class="section-label">Modul: Bild / Kamera</div>
                ${this._toggle("Medien anzeigen", "show_media", this._show_media)}
                ${this._picker("GIF Sensor", "gif_sensor", this._gif_sensor)}
                ${this._picker("Camera Entity", "camera_entity", this._camera_entity, "camera")}
            </div>`;
    }

    static get styles() {
        return css`
            .card-config { display: flex; flex-direction: column; gap: 4px; }
            .section-label {
                font-size: 0.72em; font-weight: 700; text-transform: uppercase;
                letter-spacing: 1px; color: var(--primary-color);
                margin-top: 14px; padding-bottom: 5px;
                border-bottom: 2px solid var(--primary-color);
            }
            .switch-row { display: flex; align-items: center; gap: 12px; padding: 8px 0 4px; }
            .switch-row span { font-size: 0.9em; color: var(--primary-text-color); }
        `;
    }
}
customElements.define("mail-and-packages-card-editor", MailAndPackagesCardEditor);
// ─────────────────────────────────────────────────────────────────────────────

function animateCount(el, target, duration) {
    const to = parseInt(target, 10) || 0;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(to * eased);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

class MailAndPackagesCard extends LitElement {

    static get properties() {
        return { _config: {}, hass: {} };
    }

    static getConfigElement() {
        return document.createElement("mail-and-packages-card-editor");
    }

    static getStubConfig() { return {}; }

    setConfig(config) {
        this._config = config;
    }

    shouldUpdate(changedProps) {
        return changedProps.has("_config") || changedProps.has("hass");
    }

    updated() {
        const root = this.shadowRoot || this;
        root.querySelectorAll('[data-count]').forEach(el => {
            animateCount(el, el.dataset.count, 700);
        });
    }

    _state(key) {
        return this._config[key] ? this.hass.states[this._config[key]]?.state ?? false : false;
    }

    render() {
        if (!this._config || !this.hass) return html``;

        if (!this._config.updated) {
            return html`${this._style()}<ha-card><div class="not-found">⚠️ Bitte zuerst "Mail Updated Sensor" konfigurieren.</div></ha-card>`;
        }

        const stateObj = this.hass.states[this._config.updated];
        if (!stateObj) {
            return html`${this._style()}<ha-card><div class="not-found">Entity nicht gefunden: ${this._config.updated}</div></ha-card>`;
        }

        const showSummary  = this._config.show_summary  !== false;
        const showMessage  = this._config.show_message  !== false;
        const showCarriers = this._config.show_carriers !== false;
        const showMedia    = this._config.show_media    !== false;

        return html`
            ${this._style()}
            <ha-card>
                ${this._renderHeader(stateObj)}
                ${showSummary  ? this._renderSummary()  : ""}
                ${showMessage  ? this._renderMessage()  : ""}
                ${showCarriers ? this._renderCarriers() : ""}
                ${showMedia    ? this._renderMedia()    : ""}
            </ha-card>`;
    }

    _renderHeader(stateObj) {
        return html`
            <div class="mod-header" @click="${this._handleClick}">
                <div class="mod-header-left">
                    <ha-icon icon="mdi:mailbox" class="mod-header-icon"></ha-icon>
                    <span class="mod-header-title">${this._config.name || "Mail & Packages"}</span>
                </div>
                <span class="mod-header-time">
                    <ha-icon icon="mdi:clock-outline" style="--mdc-icon-size:13px;opacity:.7"></ha-icon>
                    ${stateObj.state}
                </span>
            </div>`;
    }

    _renderSummary() {
        const delivered  = this._state("packages_delivered");
        const in_transit = this._state("packages_in_transit");
        if (delivered === false && in_transit === false) return "";
        return html`
            <div class="mod-summary">
                ${in_transit !== false ? html`
                <div class="mod-stat transit">
                    <ha-icon icon="mdi:truck-delivery" class="mod-stat-icon"></ha-icon>
                    <span class="mod-stat-num" data-count="${in_transit}">0</span>
                    <span class="mod-stat-label">In Transit</span>
                </div>` : ""}
                ${delivered !== false ? html`
                <div class="mod-stat delivered">
                    <ha-icon icon="mdi:package-check" class="mod-stat-icon"></ha-icon>
                    <span class="mod-stat-num" data-count="${delivered}">0</span>
                    <span class="mod-stat-label">Delivered</span>
                </div>` : ""}
            </div>`;
    }

    _renderMessage() {
        const msg = this._state("deliveries_message");
        if (!msg) return "";
        return html`
            <div class="mod-message">
                <ha-icon icon="mdi:information-outline" class="mod-message-icon"></ha-icon>
                <span>${msg}</span>
            </div>`;
    }

    _renderCarriers() {
        const carriers = [
            { key: "usps_mail",       label: "USPS Mail",  icon: "mailbox-outline",     iconActive: "mailbox-open-up",    url: "https://informeddelivery.usps.com/" },
            { key: "usps_packages",   label: "USPS",       icon: "package-variant-closed", iconActive: "package-variant", url: "https://informeddelivery.usps.com/" },
            { key: "ups_packages",    label: "UPS",        icon: "package-variant-closed", iconActive: "package-variant", url: "https://wwwapps.ups.com/mcdp" },
            { key: "fedex_packages",  label: "FedEx",      icon: "package-variant-closed", iconActive: "package-variant", url: "https://www.fedex.com/apps/fedextracking" },
            { key: "amazon_packages", label: "Amazon",     icon: "package-variant-closed", iconActive: "package-variant", url: "https://www.amazon.com/gp/css/order-history/" },
            { key: "dhl_packages",    label: "DHL",        icon: "package-variant-closed", iconActive: "package-variant", url: "https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html" },
            { key: "dpd_packages",    label: "DPD",        icon: "package-variant-closed", iconActive: "package-variant", url: "https://www.dpd.com/de/de/empfangen/tracking/" },
            { key: "gls_packages",    label: "GLS",        icon: "package-variant-closed", iconActive: "package-variant", url: "https://gls-group.com/track" },
            { key: "hermes_packages", label: "Hermes",     icon: "package-variant-closed", iconActive: "package-variant", url: "https://www.myhermes.de/empfangen/sendungsverfolgung/" },
        ].filter(c => this._config[c.key]);

        if (!carriers.length) return "";

        return html`
            <div class="mod-carriers">
                <div class="mod-block-title">
                    <ha-icon icon="mdi:truck-fast-outline"></ha-icon> Carrier
                </div>
                <div class="mod-carrier-grid">
                    ${carriers.map(c => {
                        const count  = this._state(c.key);
                        const active = parseInt(count) > 0;
                        return html`
                            <a href="${c.url}" target="_blank" class="mod-carrier ${active ? "active" : ""}">
                                <ha-icon icon="mdi:${active ? c.iconActive : c.icon}" class="mod-carrier-icon"></ha-icon>
                                <span class="mod-carrier-name">${c.label}</span>
                                <span class="mod-carrier-count ${active ? "active" : ""}" data-count="${count}">0</span>
                            </a>`;
                    })}
                </div>
            </div>`;
    }

    _renderMedia() {
        const gif    = this._config.gif_sensor    ? this.hass.states[this._config.gif_sensor]?.state    : null;
        const camera = this._config.camera_entity ? this.hass.states[this._config.camera_entity]?.attributes?.entity_picture : null;
        const src    = gif || camera ? (gif || `${camera}&interval=30`) : null;
        if (!src) return "";
        return html`<img class="mod-media" src="${src}" />`;
    }

    _handleClick() {
        fireEvent(this, "hass-more-info", { entityId: this._config.updated });
    }

    getCardSize() { return 3; }

    _style() {
        return html`<style>
            ha-card {
                overflow: hidden;
                padding: 0;
            }

            .not-found {
                padding: 14px 16px;
                color: var(--warning-color, #ff9800);
                font-size: 0.9em;
            }

            /* ── Header ── */
            .mod-header {
                background: linear-gradient(135deg,
                    var(--primary-color, #03a9f4) 0%,
                    color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000) 100%);
                padding: 13px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;
            }
            .mod-header-left { display: flex; align-items: center; gap: 9px; }
            .mod-header-icon { --mdc-icon-size: 24px; color: rgba(255,255,255,.9); }
            .mod-header-title { font-size: 1.05em; font-weight: 600; color: #fff; letter-spacing: .3px; }
            .mod-header-time { font-size: 0.7em; color: rgba(255,255,255,.75); display: flex; align-items: center; gap: 3px; }

            /* ── Summary ── */
            .mod-summary {
                display: flex;
                border-bottom: 1px solid var(--divider-color);
            }
            .mod-stat {
                flex: 1;
                padding: 14px 12px;
                text-align: center;
                border-right: 1px solid var(--divider-color);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
            }
            .mod-stat:last-child { border-right: none; }
            .mod-stat-icon { --mdc-icon-size: 18px; opacity: .7; }
            .mod-stat.transit  .mod-stat-icon { color: var(--primary-color, #03a9f4); }
            .mod-stat.delivered .mod-stat-icon { color: #4caf50; }
            .mod-stat-num {
                font-size: 2.2em;
                font-weight: 700;
                line-height: 1;
                font-variant-numeric: tabular-nums;
            }
            .mod-stat.transit  .mod-stat-num  { color: var(--primary-color, #03a9f4); }
            .mod-stat.delivered .mod-stat-num { color: #4caf50; }
            .mod-stat-label {
                font-size: 0.58em;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--secondary-text-color);
            }

            /* ── Message ── */
            .mod-message {
                padding: 9px 14px;
                background: rgba(var(--rgb-primary-color, 3,169,244), 0.07);
                border-bottom: 1px solid var(--divider-color);
                border-left: 3px solid var(--primary-color, #03a9f4);
                display: flex;
                align-items: flex-start;
                gap: 8px;
                font-size: 0.82em;
                color: var(--primary-text-color);
                line-height: 1.4;
            }
            .mod-message-icon { --mdc-icon-size: 16px; color: var(--primary-color, #03a9f4); margin-top: 1px; flex-shrink: 0; }

            /* ── Carriers ── */
            .mod-carriers { border-bottom: 1px solid var(--divider-color); }
            .mod-block-title {
                padding: 7px 14px 5px;
                font-size: 0.65em;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--secondary-text-color);
                display: flex;
                align-items: center;
                gap: 4px;
                border-bottom: 1px solid var(--divider-color);
                background: var(--secondary-background-color, rgba(0,0,0,.03));
            }
            .mod-block-title ha-icon { --mdc-icon-size: 14px; }

            .mod-carrier-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
            }
            .mod-carrier {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 14px;
                text-decoration: none;
                border-right: 1px solid var(--divider-color);
                border-bottom: 1px solid var(--divider-color);
                transition: background 0.15s ease;
            }
            .mod-carrier:nth-child(even) { border-right: none; }
            .mod-carrier:hover { background: var(--secondary-background-color); }

            .mod-carrier-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); flex-shrink: 0; }
            .mod-carrier.active .mod-carrier-icon { color: var(--primary-color, #03a9f4); }

            .mod-carrier-name {
                flex: 1;
                font-size: 0.82em;
                color: var(--primary-text-color);
                white-space: nowrap;
            }
            .mod-carrier-count {
                font-size: 1.1em;
                font-weight: 700;
                color: var(--secondary-text-color);
                font-variant-numeric: tabular-nums;
                min-width: 18px;
                text-align: right;
            }
            .mod-carrier-count.active { color: var(--primary-color, #03a9f4); }

            /* ── Media ── */
            .mod-media { display: block; width: 100%; height: auto; }
        </style>`;
    }
}

customElements.define("mail-and-packages-card", MailAndPackagesCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "mail-and-packages-card",
    name: "Mail and Packages",
    description: "Modular card for mail and package delivery tracking",
    preview: false,
});
