const LitElement = customElements.get("hui-masonry-view")
  ? Object.getPrototypeOf(customElements.get("hui-masonry-view"))
  : Object.getPrototypeOf(customElements.get("hui-view"));
const html = LitElement.prototype.html;

const fireEvent = (node, type, detail, options) => {
    options = options || {};
    detail = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
};

function hasConfigOrEntityChanged(element, changedProps) {
    if (changedProps.has("_config")) {
        return true;
    }
    return true;
}

function animateCount(el, target, duration) {
    const to = parseInt(target, 10) || 0;
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(to * eased);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

class MailAndPackagesCard extends LitElement {
    static get properties() {
        return {
            _config: {},
            hass: {}
        };
    }

    static async getConfigElement() {
        await import("./Home-Assistant-Mail-And-Packages-Custom-Card-editor.js");
        return document.createElement("mail-and-packages-card-editor");
    }

    static getStubConfig() {
        return {};
    }

    setConfig(config) {
        if (!config.updated) {
            throw new Error("The sensor sensor.mail_updated is not found or not defined in lovelace.");
        }
        this._config = config;
    }

    shouldUpdate(changedProps) {
        return hasConfigOrEntityChanged(this, changedProps);
    }

    updated() {
        const root = this.shadowRoot || this;
        root.querySelectorAll('[data-count]').forEach(el => {
            animateCount(el, el.dataset.count, 800);
        });
    }

    render() {
        if (!this._config || !this.hass) {
            return html``;
        }

        this.numberElements = 0;
        const stateObj = this.hass.states[this._config.updated];

        if (!stateObj) {
            return html`
                ${this.renderStyle()}
                <ha-card>
                    <div class="not-found">
                        Entity not available: ${this._config.updated}
                    </div>
                </ha-card>
            `;
        }

        return html`
            ${this.renderStyle()}
            <ha-card>
                ${this._config.details !== false ? this.renderDetails(stateObj) : ""}
                ${this._config.image !== false ? this.renderImage(stateObj) : ""}
                ${this._config.camera !== false ? this.renderCamera(stateObj) : ""}
                <div class="card-footer">
                    <ha-icon icon="mdi:clock-outline" class="footer-icon"></ha-icon>
                    Checked: ${stateObj.state}
                </div>
            </ha-card>
        `;
    }

    renderDetails(stateObj) {
        const deliveries_message = this._config.deliveries_message ? this.hass.states[this._config.deliveries_message].state : false;
        const packages_delivered = this._config.packages_delivered ? this.hass.states[this._config.packages_delivered].state : false;
        const packages_in_transit = this._config.packages_in_transit ? this.hass.states[this._config.packages_in_transit].state : false;
        const fedex_packages = this._config.fedex_packages ? this.hass.states[this._config.fedex_packages].state : false;
        const ups_packages = this._config.ups_packages ? this.hass.states[this._config.ups_packages].state : false;
        const usps_packages = this._config.usps_packages ? this.hass.states[this._config.usps_packages].state : false;
        const amazon_packages = this._config.amazon_packages ? this.hass.states[this._config.amazon_packages].state : false;
        const usps_mail = this._config.usps_mail ? this.hass.states[this._config.usps_mail].state : false;

        const mail_icon   = usps_mail > 0       ? 'mailbox-open-up'        : 'mailbox-outline';
        const usps_icon   = usps_packages > 0   ? 'package-variant'        : 'package-variant-closed';
        const ups_icon    = ups_packages > 0    ? 'package-variant'        : 'package-variant-closed';
        const fedex_icon  = fedex_packages > 0  ? 'package-variant'        : 'package-variant-closed';
        const amazon_icon = amazon_packages > 0 ? 'package-variant'        : 'package-variant-closed';

        this.numberElements++;

        return html`
            <div class="card-header" @click="${this._handleClick}">
                <ha-icon icon="mdi:mailbox" class="header-icon"></ha-icon>
                <span class="header-title">${this._config.name || "Mail & Packages"}</span>
            </div>

            ${packages_delivered !== false || packages_in_transit !== false ? html`
            <div class="summary-row">
                ${packages_delivered !== false ? html`
                <div class="summary-box delivered">
                    <ha-icon icon="mdi:package-check" class="summary-icon"></ha-icon>
                    <div class="summary-number" data-count="${packages_delivered}">0</div>
                    <div class="summary-label">Delivered</div>
                </div>
                ` : ""}
                ${packages_in_transit !== false ? html`
                <div class="summary-box transit">
                    <ha-icon icon="mdi:truck-delivery" class="summary-icon"></ha-icon>
                    <div class="summary-number" data-count="${packages_in_transit}">0</div>
                    <div class="summary-label">In Transit</div>
                </div>
                ` : ""}
            </div>
            ` : ""}

            ${deliveries_message ? html`
            <div class="message-box">
                <ha-icon icon="mdi:information-outline" class="msg-icon"></ha-icon>
                ${deliveries_message}
            </div>
            ` : ""}

            <div class="carriers-grid">
                ${usps_mail !== false ? html`
                <a href="https://informeddelivery.usps.com/" title="USPS Informed Delivery" target="_blank" class="carrier-item ${usps_mail > 0 ? 'has-items' : ''}">
                    <ha-icon icon="mdi:${mail_icon}" class="carrier-icon"></ha-icon>
                    <div class="carrier-count" data-count="${usps_mail}">0</div>
                    <div class="carrier-label">Mail</div>
                </a>
                ` : ""}
                ${usps_packages !== false ? html`
                <a href="https://informeddelivery.usps.com/" title="USPS Informed Delivery" target="_blank" class="carrier-item ${usps_packages > 0 ? 'has-items' : ''}">
                    <ha-icon icon="mdi:${usps_icon}" class="carrier-icon"></ha-icon>
                    <div class="carrier-count" data-count="${usps_packages}">0</div>
                    <div class="carrier-label">USPS</div>
                </a>
                ` : ""}
                ${ups_packages !== false ? html`
                <a href="https://wwwapps.ups.com/mcdp" title="UPS MyChoice" target="_blank" class="carrier-item ${ups_packages > 0 ? 'has-items' : ''}">
                    <ha-icon icon="mdi:${ups_icon}" class="carrier-icon"></ha-icon>
                    <div class="carrier-count" data-count="${ups_packages}">0</div>
                    <div class="carrier-label">UPS</div>
                </a>
                ` : ""}
                ${fedex_packages !== false ? html`
                <a href="https://www.fedex.com/apps/fedextracking" title="FedEx Tracking" target="_blank" class="carrier-item ${fedex_packages > 0 ? 'has-items' : ''}">
                    <ha-icon icon="mdi:${fedex_icon}" class="carrier-icon"></ha-icon>
                    <div class="carrier-count" data-count="${fedex_packages}">0</div>
                    <div class="carrier-label">FedEx</div>
                </a>
                ` : ""}
                ${amazon_packages !== false ? html`
                <a href="https://www.amazon.com/gp/css/order-history/" title="Amazon Orders" target="_blank" class="carrier-item ${amazon_packages > 0 ? 'has-items' : ''}">
                    <ha-icon icon="mdi:${amazon_icon}" class="carrier-icon"></ha-icon>
                    <div class="carrier-count" data-count="${amazon_packages}">0</div>
                    <div class="carrier-label">Amazon</div>
                </a>
                ` : ""}
            </div>
        `;
    }

    renderImage(image) {
        const gif = this._config.gif_sensor;
        if (!image || image.length < 2 || !gif || gif.length < 2) {
            return html``;
        }
        const gif_sensor = this._config.gif_sensor ? this.hass.states[this._config.gif_sensor].state : false;
        this.numberElements++;
        return html`<img class="MailImg" src="${gif_sensor}" />`;
    }

    renderCamera(camera) {
        const camera_entity = this._config.camera_entity;
        if (!camera || camera.length === 0 || !camera_entity || camera_entity.length === 0) {
            return html``;
        }
        const camera_url = this.hass.states[this._config.camera_entity].attributes.entity_picture;
        this.numberElements++;
        return html`<img class="MailImg" src="${camera_url}&interval=30" />`;
    }

    _handleClick() {
        fireEvent(this, "hass-more-info", {
            entityId: this._config.updated
        });
    }

    getCardSize() {
        return 3;
    }

    renderStyle() {
        return html`
            <style>
                ha-card {
                    cursor: pointer;
                    margin: auto;
                    padding: 0;
                    position: relative;
                    background: rgba(var(--rgb-card-background-color, 18, 18, 18), 0.6);
                    backdrop-filter: blur(14px);
                    -webkit-backdrop-filter: blur(14px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 20px;
                    box-shadow:
                        0 8px 32px rgba(0, 0, 0, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    transition: box-shadow 0.3s ease, transform 0.2s ease;
                }

                ha-card:hover {
                    box-shadow:
                        0 14px 42px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
                    transform: translateY(-1px);
                }

                .not-found {
                    padding: 14px;
                    background: rgba(255, 200, 0, 0.15);
                    border-left: 4px solid #ffc107;
                    color: var(--primary-text-color);
                    margin: 12px;
                    border-radius: 8px;
                    font-size: 0.9em;
                }

                /* ── Header ── */
                .card-header {
                    background: linear-gradient(135deg,
                        var(--primary-color, #03a9f4) 0%,
                        color-mix(in srgb, var(--primary-color, #03a9f4) 60%, #000) 100%);
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .header-icon {
                    --mdc-icon-size: 26px;
                    color: rgba(255, 255, 255, 0.9);
                    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
                }

                .header-title {
                    font-size: 1.1em;
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: 0.4px;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                }

                /* ── Summary boxes ── */
                .summary-row {
                    display: flex;
                    gap: 10px;
                    padding: 14px 14px 0;
                }

                .summary-box {
                    flex: 1;
                    border-radius: 14px;
                    padding: 12px 8px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                }

                .summary-box.delivered {
                    border-color: rgba(76, 175, 80, 0.35);
                    background: rgba(76, 175, 80, 0.1);
                }

                .summary-box.transit {
                    border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.35);
                    background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
                }

                .summary-icon {
                    --mdc-icon-size: 20px;
                    opacity: 0.8;
                }

                .summary-box.delivered .summary-icon { color: #4caf50; }
                .summary-box.transit  .summary-icon { color: var(--primary-color, #03a9f4); }

                .summary-number {
                    font-size: 2.4em;
                    font-weight: 700;
                    line-height: 1.1;
                    margin: 2px 0;
                    font-variant-numeric: tabular-nums;
                }

                .summary-box.delivered .summary-number { color: #4caf50; }
                .summary-box.transit  .summary-number { color: var(--primary-color, #03a9f4); }

                .summary-label {
                    font-size: 0.62em;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    color: var(--secondary-text-color);
                }

                /* ── Message box ── */
                .message-box {
                    margin: 12px 14px 0;
                    padding: 9px 12px;
                    background: rgba(255, 152, 0, 0.12);
                    border-radius: 10px;
                    border-left: 3px solid var(--accent-color, #ff9800);
                    font-size: 0.82em;
                    color: var(--primary-text-color);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    line-height: 1.4;
                }

                .msg-icon {
                    --mdc-icon-size: 16px;
                    color: var(--accent-color, #ff9800);
                    flex-shrink: 0;
                }

                /* ── Carrier grid ── */
                .carriers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
                    gap: 8px;
                    padding: 12px 14px 14px;
                }

                .carrier-item {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    padding: 11px 6px 9px;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.09);
                    transition: background 0.2s ease, transform 0.2s ease,
                                box-shadow 0.2s ease, border-color 0.2s ease;
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                }

                .carrier-item:hover {
                    background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18);
                    border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.45);
                    transform: translateY(-3px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
                }

                .carrier-item.has-items {
                    border-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.3);
                    background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
                }

                .carrier-icon {
                    --mdc-icon-size: 22px;
                    color: var(--paper-item-icon-color);
                }

                .carrier-item.has-items .carrier-icon {
                    color: var(--primary-color, #03a9f4);
                }

                .carrier-count {
                    font-size: 1.25em;
                    font-weight: 700;
                    color: var(--primary-text-color);
                    font-variant-numeric: tabular-nums;
                    line-height: 1;
                }

                .carrier-item.has-items .carrier-count {
                    color: var(--primary-color, #03a9f4);
                }

                .carrier-label {
                    font-size: 0.6em;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: var(--secondary-text-color);
                }

                /* ── Images ── */
                .MailImg {
                    display: block;
                    width: 100%;
                    height: auto;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                /* ── Footer ── */
                .card-footer {
                    padding: 7px 14px;
                    font-size: 0.62em;
                    color: var(--disabled-text-color);
                    border-top: 1px solid rgba(255, 255, 255, 0.07);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 4px;
                }

                .footer-icon {
                    --mdc-icon-size: 12px;
                    opacity: 0.6;
                }
            </style>
        `;
    }
}

customElements.define("mail-and-packages-card", MailAndPackagesCard);
