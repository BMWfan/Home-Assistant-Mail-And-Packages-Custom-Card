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

const LitElement = customElements.get("hui-masonry-view") ?
    Object.getPrototypeOf(customElements.get("hui-masonry-view")) :
    Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

export class MailAndPackagesCardEditor extends LitElement {

    static get properties() {
        return {
            hass: {},
            _config: {}
        };
    }

    setConfig(config) {
        this._config = config;
    }

    get _name()               { return this._config.name || ""; }
    get _updated()            { return this._config.updated || ""; }
    get _deliveries_message() { return this._config.deliveries_message || ""; }
    get _packages_delivered() { return this._config.packages_delivered || ""; }
    get _packages_in_transit(){ return this._config.packages_in_transit || ""; }
    get _fedex_packages()     { return this._config.fedex_packages || ""; }
    get _ups_packages()       { return this._config.ups_packages || ""; }
    get _usps_packages()      { return this._config.usps_packages || ""; }
    get _amazon_packages()    { return this._config.amazon_packages || ""; }
    get _usps_mail()          { return this._config.usps_mail || ""; }
    get _gif_sensor()         { return this._config.gif_sensor || ""; }
    get _camera_entity()      { return this._config.camera_entity || ""; }
    get _image()              { return this._config.image !== false; }
    get _camera()             { return this._config.camera !== false; }
    get _details()            { return this._config.details !== false; }

    _picker(label, configValue, value, domain = "sensor") {
        return html`
            <ha-entity-picker
                label="${label}"
                .hass="${this.hass}"
                .value="${value}"
                .configValue="${configValue}"
                .includeDomains="${[domain]}"
                @value-changed="${this._valueChanged}"
                allow-custom-entity
            ></ha-entity-picker>
        `;
    }

    render() {
        if (!this.hass) {
            return html``;
        }

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

                <div class="section-label">Pakete</div>
                ${this._picker("Packages Delivered Sensor", "packages_delivered", this._packages_delivered)}
                ${this._picker("Packages In Transit Sensor", "packages_in_transit", this._packages_in_transit)}
                ${this._picker("Delivery Message Sensor", "deliveries_message", this._deliveries_message)}

                <div class="section-label">Carrier</div>
                ${this._picker("USPS Mail Sensor", "usps_mail", this._usps_mail)}
                ${this._picker("USPS Package Sensor", "usps_packages", this._usps_packages)}
                ${this._picker("UPS Package Sensor", "ups_packages", this._ups_packages)}
                ${this._picker("FedEx Package Sensor", "fedex_packages", this._fedex_packages)}
                ${this._picker("Amazon Package Sensor", "amazon_packages", this._amazon_packages)}
                ${this._picker("DHL Package Sensor", "dhl_packages", this._dhl_packages)}
                ${this._picker("DPD Package Sensor", "dpd_packages", this._dpd_packages)}
                ${this._picker("GLS Package Sensor", "gls_packages", this._gls_packages)}
                ${this._picker("Hermes Package Sensor", "hermes_packages", this._hermes_packages)}
                ${this._picker("DHL Package Sensor", "dhl_packages", this._dhl_packages)}
                ${this._picker("DPD Package Sensor", "dpd_packages", this._dpd_packages)}
                ${this._picker("GLS Package Sensor", "gls_packages", this._gls_packages)}
                ${this._picker("Hermes Package Sensor", "hermes_packages", this._hermes_packages)}

                <div class="section-label">Bild / Kamera</div>
                <div class="switch-row">
                    <ha-switch
                        .checked="${this._image}"
                        .configValue="${"image"}"
                        @change="${this._valueChanged}"
                    ></ha-switch>
                    <span>GIF-Bild anzeigen</span>
                </div>
                ${this._picker("GIF Sensor", "gif_sensor", this._gif_sensor)}

                <div class="switch-row">
                    <ha-switch
                        .checked="${this._camera}"
                        .configValue="${"camera"}"
                        @change="${this._valueChanged}"
                    ></ha-switch>
                    <span>Kamera anzeigen</span>
                </div>
                ${this._picker("Camera Entity", "camera_entity", this._camera_entity, "camera")}
            </div>
        `;
    }

    _valueChanged(ev) {
        if (!this._config || !this.hass) return;
        const target = ev.target;
        const value = target.checked !== undefined ? target.checked : target.value;
        if (this[`_${target.configValue}`] === value) return;
        if (target.configValue) {
            this._config = value === ""
                ? (({ [target.configValue]: _, ...rest }) => rest)(this._config)
                : { ...this._config, [target.configValue]: value };
        }
        fireEvent(this, "config-changed", { config: this._config });
    }

    static get styles() {
        return css`
            .card-config {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .section-label {
                font-size: 0.75em;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: var(--secondary-text-color);
                margin-top: 12px;
                margin-bottom: 2px;
                padding-bottom: 4px;
                border-bottom: 1px solid var(--divider-color);
            }
            .switch-row {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 0 4px;
            }
            .switch-row span {
                font-size: 0.9em;
                color: var(--primary-text-color);
            }
        `;
    }
}

customElements.define("mail-and-packages-card-editor", MailAndPackagesCardEditor);
