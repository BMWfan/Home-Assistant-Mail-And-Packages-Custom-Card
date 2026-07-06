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

// Monochrome carrier logos (simple-icons, CC0/MIT), rendered in brand colors.
const CARRIER_LOGOS = {
  dhl: "M4.22 10.303l-.767 1.043h4.18c.21 0 .208.078.105.218-.105.142-.28.39-.386.534-.054.073-.154.207.171.207h1.71l.505-.69c.314-.426.028-1.312-1.095-1.312H4.22zm7.204 0l-1.475 2.002h5.39l1.473-2.002H14.61l-.843 1.146h-.985l.846-1.146h-2.203zm6.105 0l-1.474 2.002h2.334l1.472-2.002H17.53zm-12.845 1.3l-1.54 2.094h3.754c1.24 0 1.932-.844 2.145-1.136h-2.56c-.326 0-.226-.133-.172-.207.107-.143.283-.388.388-.53.104-.14.107-.22-.105-.22h-1.91zM0 12.562v.242h3.398l.176-.242H0zm9.762 0l-.836 1.136h2.203l.836-1.136H9.762zm3.185 0l-.836 1.136h2.203l.836-1.136h-2.203zm2.918 0s-.159.22-.238.326c-.276.374-.033.81.87.81h3.538l.834-1.136h-5.004zm5.408 0l-.177.242H24v-.242h-2.727zM0 13.01v.24h3.068l.178-.24H0zm20.943 0l-.175.24H24v-.24h-3.057zM0 13.457v.24h2.74l.176-.24H0zm20.615 0l-.177.24H24v-.24h-3.385z",
  ups: "M11.668 14.544l-.028-5.226c.138-.055.387-.111.608-.111.995 0 1.41.774 1.41 2.682 0 1.853-.47 2.765-1.438 2.765-.22 0-.441-.055-.552-.11zM3.124 7.438c4.203-3.843 9.29-4.866 14.018-4.866 1.3 0 2.544.083 3.76.194h-.028v11.253c0 2.184-.774 3.926-2.295 5.171-1.355 1.134-5.447 2.959-6.581 3.456-1.161-.525-5.253-2.378-6.581-3.456-1.493-1.244-2.295-3.014-2.295-5.171V7.438zm12.664 2.599c.028.912.276 1.576 1.687 2.406.747.442 1.051.747 1.051 1.272 0 .581-.387.94-1.023.94-.553 0-1.189-.304-1.631-.691v1.576c.553.304 1.217.525 1.88.525 1.687 0 2.433-1.189 2.461-2.267.028-.995-.249-1.742-1.659-2.571-.608-.387-1.134-.636-1.106-1.244 0-.581.525-.802.995-.802.581 0 1.161.332 1.521.691V8.378c-.304-.221-.94-.581-1.88-.553-1.135.028-2.296.829-2.296 2.212zm-5.834 9.484h1.714l-.028-3.594c.166.028.415.083.774.083 1.908 0 2.986-1.687 2.986-4.175 0-2.461-1.106-4.009-3.152-4.009-.94 0-1.687.221-2.295.608v11.087zm-5.945-6.166c0 1.797.829 2.71 2.516 2.71 1.051 0 1.908-.249 2.571-.691V7.991H7.41v6.387c-.194.138-.47.221-.802.221-.774 0-.885-.719-.885-1.189V7.991H4.009v5.364zM22.12 2.295v11.723c0 2.516-.94 4.645-2.765 6.111-1.549 1.3-6.332 3.429-7.355 3.871-1.023-.442-5.806-2.571-7.355-3.843-1.797-1.465-2.765-3.594-2.765-6.111V2.295C4.756.747 8.074 0 12 0s7.244.747 10.12 2.295zm-.304.221c-2.71-1.465-6-2.184-9.788-2.184s-7.079.746-9.788 2.184v11.502c0 2.433.912 4.452 2.627 5.862 1.576 1.3 6.581 3.484 7.161 3.76.581-.249 5.585-2.433 7.161-3.733 1.714-1.41 2.627-3.429 2.627-5.862V2.516zm-2.433 20.295c0 .47-.387.829-.829.829a.831.831 0 0 1-.829-.829c0-.47.387-.829.829-.829.441 0 .801.359.829.829zm-.166 0a.679.679 0 0 0-.664-.691c-.359 0-.664.332-.664.691 0 .359.304.664.664.664a.673.673 0 0 0 .664-.664zm-.553.055c.028.055.304.442.304.442h-.221s-.276-.387-.276-.415h-.028v.415h-.194v-.995l.304-.028c.249 0 .332.166.332.304s-.083.25-.221.277zm.027-.276c0-.055 0-.138-.166-.138h-.083v.304h.028c.194 0 .221-.083.221-.166z",
  fedex: "M22.498 14.298c-.016-.414.345-.751.75-.755a.745.745 0 0 1 .752.755.755.755 0 0 1-.751.745c-.395.002-.759-.346-.751-.745zm.759-.083c.067-.02.164-.042.162-.13.007-.09-.086-.133-.162-.134h-.163v.263c0 .001.165-.002.163.001zm-.163.107v.418h-.14v-.91h.327c.156-.021.294.092.286.253a.218.218 0 0 1-.156.19c.162.083.108.322.173.467h-.156a2.355 2.355 0 0 1-.04-.205c-.018-.093-.047-.229-.17-.213h-.124zm.76-.024a.603.603 0 0 0-.605-.632c-.338-.012-.62.302-.605.632a.619.619 0 0 0 .605.622.61.61 0 0 0 .605-.622zm-5.052-.579l-.878 1.008h-1.306l1.559-1.745-1.56-1.75h1.355l.902.997.878-.998h1.306l-1.543 1.743 1.559 1.753h-1.371l-.901-1.008zm-4.703-.352v-.827h1.904v-1.506l1.724 1.948-1.724 1.941v-1.556h-1.904zm1.56 1.36h-3.2V9.044h3.224v1.024H13.77v1.163h1.888v.958h-1.904v1.522h1.904v1.016zm-5.705-.655c-.54.017-.878-.552-.877-1.04-.01-.507.307-1.123.878-1.105.579-.025.871.6.845 1.103.023.501-.29 1.062-.846 1.042zM4.743 12.41c.076-.358.403-.67.78-.663a.788.788 0 0 1 .803.663H4.743zm15.182.564l1.815-2.047h-2.125l-.74.844-.763-.844h-4.037v-.548h1.912V8.741H10.84v2.58c-.362-.448-.981-.559-1.526-.492-.782.123-1.427.762-1.634 1.514-.254-.958-1.179-1.588-2.157-1.554-.781.009-1.6.365-1.987 1.071v-.818h-1.87v-.9h2.043v-1.4H0v6.287h1.666v-2.644h1.666a7.59 7.59 0 0 0-.082.622c-.013 1.232 1.042 2.27 2.274 2.236a2.204 2.204 0 0 0 2.157-1.432H6.254c-.14.268-.441.38-.73.36-.457.009-.83-.417-.829-.86h2.914c.083 1.027.988 1.966 2.043 1.947a1.53 1.53 0 0 0 1.19-.639v.41h7.215l.754-.86.754.86h2.192l-1.832-2.055z",
  usps: "M3.145 4.577L0 19.423h20.855L24 4.577H3.145zm-.157 3.806h9.436c.157 0 5.064 0 5.159.975H9.09l1.321 4.026c1.51-.723 5.222-2.233 7.455-2.328.944-.031 1.321.126 1.132.252-.126.063-1.038.189-1.761.377-1.258.315-1.321.315-2.642.755-1.478.503-2.705 1.069-4.53 1.919L.723 18.983l2.265-10.6zm16.483 1.698c-.535-.094-2.768.063-3.334.063-.126 0-.472.031-.472-.063 0-.063.126-.063.377-.094s1.006-.157 1.258-.283c.063-.063.22-.157.315-.252.031-.063.063-.094.157-.094h1.164c.755 0 1.195.094 1.132.723-.031.315-.472 1.132-.629 1.384-.063.094-.189.189-.157 0 .126-.503.597-1.321.189-1.384zm.88 8.902H2.076s17.363-6.794 17.552-6.92c0 0 1.541-2.076.629-2.925-.283-.283-.692-.283-2.265-.283 0 0-.063-.598-2.485-1.164-.283-.063-11.858-2.517-11.858-2.517h19.628l-2.926 13.809zm2.925-.695c0-.195-.114-.293-.358-.293h-.406v1.008h.146v-.439h.179l.276.455h.179L23 18.564c.162-.016.276-.097.276-.276zm-.455.146h-.163v-.341h.211c.114 0 .228.016.228.163 0 .162-.13.178-.276.178zm.016-.829a.868.868 0 0 0-.894.878c0 .504.406.894.894.894s.894-.39.894-.894a.878.878 0 0 0-.894-.878zm0 1.642c-.423 0-.731-.325-.731-.764 0-.423.325-.748.731-.748.406 0 .731.325.731.748 0 .439-.325.764-.731.764z",
  amazon: "M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z",
  dpd: "M16.01 10.71a.364.364 0 01-.343-.006l-.558-.331a.43.43 0 01-.182-.312l-.014-.65a.363.363 0 01.165-.3l6.7-3.902L12.377.085A.799.799 0 0012 0a.798.798 0 00-.377.085l-9.4 5.124 10.53 6.13c.098.054.172.181.172.295v8.944c0 .112-.08.241-.178.294l-.567.315c-.171.062-.256.043-.361 0l-.569-.315a.362.362 0 01-.175-.294v-7.973a.223.223 0 00-.095-.156L1.702 7.048v10.579c0 .236.167.528.371.648l9.556 5.636c.102.06.237.09.371.089a.745.745 0 00.371-.09l9.557-5.635a.835.835 0 00.37-.648V7.047Z",
  hermes: "m21.818 4.516-1.05 4.148h2.175L24 4.516M19.41 14.04h2.17l1.04-4.08h-2.178m-2.41 9.523h2.154l1.056-4.147h-2.16m.193-5.377H5.55v.92l3.341 3.161h9.349m2.41-9.525H0v1.116l3.206 3.032H19.6m-8.372 7.58 3.43 3.24h2.205l1.05-4.147h-6.685",
};

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
  dhl: { logo: "dhl", label: "DHL", short: "DHL", bg: "#FFCC00", fg: "#D40511", url: (n) => `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${n}` },
  ups: { logo: "ups", label: "UPS", short: "UPS", bg: "#351C15", fg: "#FFB500", url: (n) => `https://www.ups.com/track?tracknum=${n}` },
  usps: { logo: "usps", label: "USPS", short: "USPS", bg: "#004B87", fg: "#ffffff", url: (n) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}` },
  fedex: { logo: "fedex", label: "FedEx", short: "FDX", bg: "#4D148C", fg: "#FF6600", url: (n) => `https://www.fedex.com/fedextrack/?trknbr=${n}` },
  gls: { label: "GLS", short: "GLS", bg: "#061AB1", fg: "#FFD100", url: (n) => `https://gls-group.com/DE/de/paket-verfolgen?match=${n}` },
  dpd: { logo: "dpd", label: "DPD", short: "DPD", bg: "#DC0032", fg: "#ffffff", url: (n) => `https://tracking.dpd.de/status/de_DE/parcel/${n}` },
  evri: { logo: "hermes", label: "Evri/Hermes", short: "HER", bg: "#009BDE", fg: "#ffffff", url: (n) => `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#${n}` },
  hermes: { logo: "hermes", label: "Hermes", short: "HER", bg: "#009BDE", fg: "#ffffff", url: (n) => `https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation#${n}` },
  royal_mail: { label: "Royal Mail", short: "RM", bg: "#DA202A", fg: "#FFD100", url: (n) => `https://www.royalmail.com/track-your-item#/tracking-results/${n}` },
  auspost: { label: "AusPost", short: "AUP", bg: "#DC1928", fg: "#ffffff", url: (n) => `https://auspost.com.au/mypost/track/#/details/${n}` },
  post_nl: { label: "PostNL", short: "PNL", bg: "#F56900", fg: "#ffffff", url: (n) => `https://jouw.postnl.nl/track-and-trace/${n}` },
  post_at: { label: "Post AT", short: "PAT", bg: "#FFD100", fg: "#000000", url: (n) => `https://www.post.at/sv/sendungsdetails?snr=${n}` },
  amazon: { logo: "amazon", label: "Amazon", short: "AMZ", bg: "#232F3E", fg: "#FF9900", url: () => "https://www.amazon.de/gp/css/order-history/" },
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
        badge: { ...meta, overlayCheck: true },
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
          ${r.badge.logo && CARRIER_LOGOS[r.badge.logo]
            ? html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="${r.badge.overlayCheck ? "blurred" : ""}">
                <path d="${CARRIER_LOGOS[r.badge.logo]}"></path>
              </svg>`
            : r.badge.short}
          ${r.badge.overlayCheck
            ? html`<span class="overlay-check">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 7 9.55 18.45 3 11.9l1.9-1.9 4.65 4.63L19.1 5.1Z"></path>
                </svg>
              </span>`
            : ""}
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
      .badge svg {
        width: 22px;
        height: 22px;
        display: block;
      }
      .badge svg.blurred {
        filter: blur(1px);
        opacity: 0.65;
      }
      .overlay-check {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--success-color, #4caf50);
      }
      .overlay-check svg {
        width: 17px;
        height: 17px;
        filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.55));
      }
      .badge {
        position: relative;
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
