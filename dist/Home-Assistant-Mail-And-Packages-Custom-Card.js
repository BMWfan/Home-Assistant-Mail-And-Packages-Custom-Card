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
    title: "Mail & Packages",
    in_transit: "unterwegs",
    out_for_delivery: "in Zustellung",
    delivered_today: "heute",
    eta_by: (t) => `bis ${t} Uhr`,
    letters: "Briefe",
    letters_today: (n) => (n === 1 ? "1 Brief kommt heute" : `${n} Briefe kommen heute`),
    letters_tomorrow: (n) => (n === 1 ? "1 Brief kommt morgen" : `${n} Briefe kommen morgen`),
    letters_announced: (n) => (n === 1 ? "1 Brief angekündigt" : `${n} Briefe angekündigt`),
    history: "Archiv",
    recently_delivered: "Kürzlich zugestellt",
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
    timeline_details: "Details",
    add_tracking: "Sendung hinzufügen",
    add_title: "Sendung hinzufügen",
    add_hint: "Trackingnummer eingeben — der Carrier wird automatisch erkannt. Händler und Bemerkung sind optional.",
    add_number_label: "Trackingnummer",
    add_detected: (label) => `Erkannt: ${label}`,
    add_retailer_label: "Händler (optional)",
    add_memo_label: "Bemerkung (optional)",
    add_submit: "Hinzufügen",
    cancel: "Abbrechen",
    remove_tracking: "Sendung entfernen",
    remove_title: "Sendung löschen?",
    remove_hint: "Wollen Sie sicher diese Sendung und den kompletten Verlauf der Sendung löschen? Das kann nicht rückgängig gemacht werden.",
    remove_submit: "Löschen",
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
    status_desc_carrier: {
      dhl: {
        InfoReceived: "Elektronisch angekündigt",
        InTransit: "Im Paketzentrum bearbeitet",
        OutForDelivery: "In das Zustellfahrzeug geladen",
        AvailableForPickup: "Liegt zur Abholung bereit",
        DeliveryFailure: "Konnte nicht zugestellt werden",
        Delivered: "Wurde ausgeliefert",
        Exception: "Zustellung verzögert sich",
      },
      dpd: {
        InfoReceived: "Auftragsdaten übermittelt",
        InTransit: "Im Paketzustellzentrum",
        OutForDelivery: "In Zustellung",
        AvailableForPickup: "Im Pickup Paketshop bereit",
        DeliveryFailure: "Empfänger nicht angetroffen",
        Delivered: "Erfolgreich zugestellt",
      },
      hermes: {
        InfoReceived: "Sendungsdaten übermittelt",
        InTransit: "Im Hermes Verteilzentrum",
        OutForDelivery: "In der Zustellung",
        AvailableForPickup: "Liegt im PaketShop zur Abholung bereit",
        DeliveryFailure: "Empfänger nicht angetroffen",
        Delivered: "Sendung wurde zugestellt",
      },
      ups: {
        InfoReceived: "Etikett erstellt",
        OutForDelivery: "Wird heute zugestellt",
        AvailableForPickup: "Wartet am Access Point auf Abholung",
        DeliveryFailure: "Empfänger nicht anwesend",
        Delivered: "Zugestellt",
      },
      fedex: {
        InTransit: "Auf dem Weg",
        OutForDelivery: "In Zustellung",
        DeliveryFailure: "Zustellausnahme",
        Exception: "Zustellausnahme",
        Delivered: "Zugestellt",
      },
      amazon: {
        InTransit: "Unterwegs",
        OutForDelivery: "Wird heute zugestellt",
        Delivered: "Zugestellt",
      },
      usps: {
        InfoReceived: "Pre-Shipment Info Sent to USPS",
        InTransit: "In Transit to Next Facility",
        OutForDelivery: "Out for Delivery",
        AvailableForPickup: "Available for Pickup",
        DeliveryFailure: "Delivery Attempted",
        Delivered: "Delivered",
      },
    },
    status_desc: {
      NotFound: "Sendung wurde angekündigt",
      InfoReceived: "Sendung wurde angekündigt",
      InTransit: "Auf dem Weg zum Ziel",
      AvailableForPickup: "Bereit zur Abholung",
      OutForDelivery: "Im Zustellfahrzeug unterwegs zu dir",
      DeliveryFailure: "Zustellung nicht möglich",
      Delivered: "Zugestellt",
      Exception: "Es gibt ein Problem mit der Sendung",
      Expired: "Sendungsverfolgung abgelaufen",
      unknown: "Sendung wurde angekündigt",
    },
  },
  en: {
    title: "Mail & Packages",
    in_transit: "in transit",
    out_for_delivery: "out for delivery",
    delivered_today: "today",
    eta_by: (t) => `by ${t}`,
    letters: "letters",
    letters_today: (n) => (n === 1 ? "1 letter arriving today" : `${n} letters arriving today`),
    letters_tomorrow: (n) => (n === 1 ? "1 letter arriving tomorrow" : `${n} letters arriving tomorrow`),
    letters_announced: (n) => (n === 1 ? "1 letter announced" : `${n} letters announced`),
    history: "Archive",
    recently_delivered: "Recently delivered",
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
    timeline_details: "Details",
    add_tracking: "Add shipment",
    add_title: "Add shipment",
    add_hint: "Enter the tracking number — the carrier is detected automatically. Retailer and note are optional.",
    add_number_label: "Tracking number",
    add_detected: (label) => `Detected: ${label}`,
    add_retailer_label: "Retailer (optional)",
    add_memo_label: "Note (optional)",
    add_submit: "Add",
    cancel: "Cancel",
    remove_tracking: "Remove shipment",
    remove_title: "Remove shipment?",
    remove_hint: "Are you sure you want to remove this shipment and its entire history? This cannot be undone.",
    remove_submit: "Remove",
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
    status_desc_carrier: {
      dhl: {
        InfoReceived: "Shipment announced electronically",
        InTransit: "Processed at parcel center",
        OutForDelivery: "Loaded onto delivery vehicle",
        AvailableForPickup: "Ready for pickup",
        DeliveryFailure: "Could not be delivered",
        Delivered: "Shipment delivered",
        Exception: "Delivery is delayed",
      },
      dpd: {
        InfoReceived: "Order data transmitted",
        InTransit: "At parcel delivery center",
        OutForDelivery: "Out for delivery",
        AvailableForPickup: "Ready at Pickup parcel shop",
        DeliveryFailure: "Recipient not found",
        Delivered: "Successfully delivered",
      },
      hermes: {
        InfoReceived: "Shipment data transmitted",
        InTransit: "At Hermes distribution center",
        OutForDelivery: "Out for delivery",
        AvailableForPickup: "Ready for pickup at PaketShop",
        DeliveryFailure: "Recipient not found",
        Delivered: "Shipment delivered",
      },
      ups: {
        InfoReceived: "Label Created",
        OutForDelivery: "Out For Delivery Today",
        AvailableForPickup: "Waiting at UPS Access Point",
        DeliveryFailure: "Recipient not available",
        Delivered: "Delivered",
      },
      fedex: {
        InTransit: "On the way",
        OutForDelivery: "Out for delivery",
        DeliveryFailure: "Delivery exception",
        Exception: "Delivery exception",
        Delivered: "Delivered",
      },
      amazon: {
        InTransit: "On the way",
        OutForDelivery: "Out for delivery today",
        Delivered: "Delivered",
      },
      usps: {
        InfoReceived: "Pre-Shipment Info Sent to USPS",
        InTransit: "In Transit to Next Facility",
        OutForDelivery: "Out for Delivery",
        AvailableForPickup: "Available for Pickup",
        DeliveryFailure: "Delivery Attempted",
        Delivered: "Delivered",
      },
    },
    status_desc: {
      NotFound: "Shipment announced",
      InfoReceived: "Shipment announced",
      InTransit: "On its way to the destination",
      AvailableForPickup: "Ready for pickup",
      OutForDelivery: "In the delivery vehicle on its way to you",
      DeliveryFailure: "Delivery was not possible",
      Delivered: "Delivered",
      Exception: "There is a problem with the shipment",
      Expired: "Tracking expired",
      unknown: "Shipment announced",
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
// Carriers that get the animated "out for delivery" truck badge, drawn as
// hand-authored flat-vector SVG shapes (no image-gen, no raster assets).
// DHL also gets the badge but keeps its own pre-existing raster <image>
// markup untouched (see _truckBadge below) -- it is intentionally not in
// this set since its branch is handled separately.
const TRUCK_VAN_LOGOS = new Set(["ups", "usps", "fedex", "dpd", "hermes", "amazon"]);
// Client-side mirror of universal.py's ORDERED_PATTERNS (most specific
// first), used ONLY for the live "Erkannt: X" preview badge while typing in
// the manual-add panel -- the authoritative classification still happens
// server-side (universal.guess_carrier + 17track's own resolution). Keep in
// sync with ORDERED_PATTERNS if it changes; a stale preview just shows the
// wrong badge for a moment; it doesn't affect what actually gets tracked.
const MANUAL_DETECT_PATTERNS = [
  ["ups", /^1Z[0-9A-Z]{16}$/],
  ["usps", /^9[2345]\d{15,26}$/],
  ["royal_mail", /^[A-Za-z]{2}[0-9]{9}GB$/],
  ["auspost", /^[A-Za-z]{2}[0-9]{9}AU$/],
  ["post_nl", /^3S[A-Z0-9]{10,18}$/],
  ["dhl", /^003404[0-9]{14}$/],
  ["evri", /^H[0-9A-Z]{15,19}$/],
  ["post_at", /^[0-9]{22}$/],
  ["dpd", /^[0-9]{14}$/],
  ["fedex", /^(?:[0-9]{12}|[0-9]{15}|[0-9]{20})$/],
  ["gls", /^[0-9]{11,12}$/],
];
function guessCarrierClient(number) {
  const n = (number || "").trim();
  if (!n) return null;
  for (const [carrier, re] of MANUAL_DETECT_PATTERNS) {
    if (re.test(n)) return carrier;
  }
  return null;
}

const carrierMeta = (key) =>
  CARRIERS[String(key || "").toLowerCase()] || {
    label: String(key || "?").toUpperCase(),
    short: String(key || "?").slice(0, 3).toUpperCase(),
    bg: "var(--secondary-background-color)",
    fg: "var(--primary-text-color)",
    url: (n) => `https://t.17track.net/de#nums=${n}`,
  };

// Carrier-native subtitle wording first (t.status_desc_carrier[carrier][status]),
// then the generic per-status text. evri is Hermes under its UK brand name.
const carrierStatusDesc = (t, carrier, statusKey) => {
  let c = String(carrier || "").toLowerCase();
  if (c === "evri") c = "hermes";
  const own = t.status_desc_carrier && t.status_desc_carrier[c];
  if (own && own[statusKey]) return own[statusKey];
  return t.status_desc && (t.status_desc[statusKey] || t.status_desc.unknown);
};

// Status string -> semantic bucket used for chip colors.
// Coarse next-milestone lookup for the timeline's "current position" node --
// keyed by the row's STATUS_KIND bucket (not the raw 17track status string),
// since that's already the granularity the card tracks per row.
const NEXT_MILESTONE_STATUS = {
  announced: "InTransit",
  transit: "OutForDelivery",
  out: "Delivered",
};

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
    return {
      _config: {},
      hass: {},
      _lettersOpen: {},
      _historyOpen: {},
      _recentOpen: {},
      _lightbox: {},
      _copied: {},
      _openTimelines: {},
      _addOpen: {},
      _addNumber: {},
      _addRetailer: {},
      _addMemo: {},
      _confirmTarget: {},
    };
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
    this._historyOpen = Boolean(this._config.history_expanded);
    this._recentOpen = Boolean(this._config.recent_expanded);
    this._openTimelines = this._openTimelines || new Set();
    this._addOpen = Boolean(this._addOpen);
    this._addNumber = this._addNumber || "";
    this._addRetailer = this._addRetailer || "";
    this._addMemo = this._addMemo || "";
    this._confirmTarget = this._confirmTarget || null;
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
      else if (oid.includes("packages_history")) found.history = id;
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
    for (const k of ["updated", "universal", "transit", "delivered", "letters", "history", "amazon", "amazon_delivered", "otp", "hub", "scan", "amazon_camera", "dhl_camera"]) {
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

  // DHL's letter-advice API returns dates as "DD.MM.YYYY" (German order).
  // Handing that straight to `new Date(...)` gets misread as US MM.DD.YYYY
  // by the engine's lenient fallback parser (e.g. "09.07.2026" -> "7 Sept"
  // instead of "9 Jul") -- parse the day/month explicitly instead of
  // trusting the ambiguous fallback.
  _parseLetterDate(raw) {
    const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(String(raw).trim());
    if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    return new Date(raw);
  }

  _letterDate(raw) {
    const t = this._t();
    if (!raw) return "";
    const d = this._parseLetterDate(raw);
    if (Number.isNaN(d.getTime())) return String(raw);
    const today = new Date();
    const diff = Math.round((d.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / 86400000);
    if (diff === 0) return t.today;
    if (diff === 1) return t.tomorrow;
    if (diff === -1) return t.yesterday;
    return this._parseLetterDate(raw).toLocaleDateString(this.hass.locale?.language || "de", { day: "numeric", month: "short" });
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

  _openAdd(ev) {
    ev.stopPropagation();
    this._addNumber = "";
    this._addRetailer = "";
    this._addMemo = "";
    this._addOpen = true;
  }

  _closeAdd() {
    this._addOpen = false;
  }

  _submitAdd(ev) {
    ev.stopPropagation();
    const number = this._addNumber.trim();
    if (!number) return;
    this.hass.callService("mail_and_packages", "add_tracking", {
      tracking_number: number,
      retailer: this._addRetailer.trim() || undefined,
      memo: this._addMemo.trim() || undefined,
    });
    this._addOpen = false;
  }

  _openConfirm(row) {
    this._confirmTarget = row;
  }

  _closeConfirm() {
    this._confirmTarget = null;
  }

  _submitRemove(ev) {
    ev.stopPropagation();
    if (!this._confirmTarget) return;
    this.hass.callService("mail_and_packages", "remove_tracking", {
      tracking_number: this._confirmTarget.number,
    });
    this._confirmTarget = null;
  }

  _renderAddOverlay(t) {
    const detected = guessCarrierClient(this._addNumber);
    const meta = detected ? carrierMeta(detected) : null;
    return html`
      <div class="overlay" @click=${(e) => e.target === e.currentTarget && this._closeAdd()}>
        <div class="sheet">
          <h3>${t.add_title}</h3>
          <p class="hint">${t.add_hint}</p>
          <div class="field">
            <label for="mpAddNumber">${t.add_number_label}</label>
            <input
              id="mpAddNumber"
              type="text"
              .value=${this._addNumber}
              @input=${(e) => (this._addNumber = e.target.value)}
              placeholder="z. B. 00340434671234567"
            />
          </div>
          <div class="detect-row">
            ${meta
              ? html`<span class="detect-badge" style="background:${meta.bg};color:${meta.fg}">
                  <ha-icon icon="mdi:check-circle"></ha-icon>${t.add_detected(meta.label)}
                </span>`
              : ""}
          </div>
          <div class="field">
            <label for="mpAddRetailer">${t.add_retailer_label}</label>
            <input
              id="mpAddRetailer"
              type="text"
              .value=${this._addRetailer}
              @input=${(e) => (this._addRetailer = e.target.value)}
            />
          </div>
          <div class="field">
            <label for="mpAddMemo">${t.add_memo_label}</label>
            <input
              id="mpAddMemo"
              type="text"
              .value=${this._addMemo}
              @input=${(e) => (this._addMemo = e.target.value)}
            />
          </div>
          <div class="sheet-actions">
            <button class="btn ghost" @click=${() => this._closeAdd()}>${t.cancel}</button>
            <button class="btn primary" ?disabled=${!this._addNumber.trim()} @click=${(e) => this._submitAdd(e)}>${t.add_submit}</button>
          </div>
        </div>
      </div>
    `;
  }

  _renderConfirmOverlay(t) {
    const r = this._confirmTarget;
    const meta = r.badge || carrierMeta(r.carrier || "");
    return html`
      <div class="overlay" @click=${(e) => e.target === e.currentTarget && this._closeConfirm()}>
        <div class="sheet">
          <h3>
            <ha-icon class="warn-icon" icon="mdi:alert-circle-outline"></ha-icon>
            ${t.remove_title}
          </h3>
          <p class="hint">${t.remove_hint}</p>
          <div class="confirm-target">
            <div class="badge" style="background:${meta.bg};color:${meta.fg}">
              ${meta.logo && CARRIER_LOGOS[meta.logo]
                ? html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${CARRIER_LOGOS[meta.logo]}"></path></svg>`
                : meta.short}
            </div>
            <div>
              <div class="ct-title">${r.title}</div>
              <div class="ct-num mono">${r.number}</div>
            </div>
          </div>
          <div class="sheet-actions">
            <button class="btn ghost" @click=${() => this._closeConfirm()}>${t.cancel}</button>
            <button class="btn danger" @click=${(e) => this._submitRemove(e)}>${t.remove_submit}</button>
          </div>
        </div>
      </div>
    `;
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
        badge: STATUS_KIND[d.status] === "out" && (meta.logo === "dhl" || TRUCK_VAN_LOGOS.has(meta.logo)) ? { ...meta, overlayTruck: true } : meta,
        title: meta.label,
        statusText: t.status[statusKey] || t.status.unknown,
        kind: STATUS_KIND[d.status] || "announced",
        event: carrierStatusDesc(t, d.carrier, statusKey) || d.last_event || "",
        eventRaw: d.last_event || "",
        location: d.last_location || "",
        time: d.last_update ? this._relTime(d.last_update) : "",
        // 17track's official ETA (a "by" deadline, not a from/to window --
        // "from" is unset on every carrier observed live). Irrelevant once
        // delivered, so only kept for in-transit/out-for-delivery rows.
        eta:
          d.estimated_delivery && d.status !== "Delivered"
            ? new Date(d.estimated_delivery).toLocaleTimeString(this.hass.locale?.language || "de", { hour: "2-digit", minute: "2-digit" })
            : "",
        number: d.number,
        url: meta.url(d.number),
        history: d.history || [],
        estimatedDelivery: d.estimated_delivery || "",
        source: d.source || "",
        retailer: d.retailer || "",
        memo: d.memo || "",
      });
    }

    // Amazon: arriving orders + optional per-order delivery code.
    const amazon = this._st(ents.amazon);
    const deliveredState = this._st(ents.amazon_delivered);
    const amazonDomain =
      (amazon && amazon.attributes.domain) ||
      (deliveredState && deliveredState.attributes.domain) ||
      (t === STRINGS.de ? "amazon.de" : "amazon.com");
    const orderUrl = (o) =>
      `https://www.${amazonDomain}/gp/your-account/order-details?orderID=${o}`;
    const otp = this._st(ents.otp);
    const otpDetails = (otp && otp.attributes.details) || [];
    const otpCodes = (otp && otp.attributes.code) || [];
    const trackingMap = {
      ...((deliveredState && deliveredState.attributes.tracking) || {}),
      ...((amazon && amazon.attributes.tracking) || {}),
    };
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
        history: [],
        number: trackingMap[order] || null,
        url: order ? orderUrl(order) : meta.url(),
        code: match ? match.code : null,
      });
    }
    // Codes we could not match to an order still need to be visible.
    const unmatched = [];
    for (const d of otpDetails) {
      if (d && d.code && !matchedCodes.has(d.code)) unmatched.push(d.code);
    }
    if (!otpDetails.length) for (const c of otpCodes) unmatched.push(c);

    // Amazon delivered today: one row per order id (+ driver photo on the first).
    const deliveredCount = this._num(ents.amazon_delivered);
    if (deliveredCount > 0) {
      const cam = this._st(ents.amazon_camera);
      const meta = carrierMeta("amazon");
      const photo = cam && cam.attributes.entity_picture ? cam.attributes.entity_picture : null;
      let deliveredOrders = (deliveredState && deliveredState.attributes.order) || [];
      if (!Array.isArray(deliveredOrders)) deliveredOrders = [deliveredOrders].filter(Boolean);
      const list = deliveredOrders.length ? deliveredOrders : [null];
      list.forEach((order, i) => {
        rows.push({
          key: `a-del-${order || i}`,
          badge: { ...meta, overlayCheck: true },
          title: "Amazon",
          statusText: t.delivered_chip,
          kind: "delivered",
          event: order
            ? `${t.order} ${order}`
            : deliveredCount === 1
              ? ""
              : `${deliveredCount}×`,
          location: "",
          time: "",
          history: [],
          number: order ? trackingMap[order] || null : null,
          url: order ? orderUrl(order) : meta.url(),
          photo: i === 0 ? photo : null,
          photoEntity: ents.amazon_camera,
        });
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
    const showHistory = cfg.show_history !== false;

    const updatedState = this._st(ents.updated);
    const transit = this._num(ents.transit);
    const delivered = this._num(ents.delivered);
    const lettersState = this._st(ents.letters);
    const letters = (lettersState && lettersState.attributes.letters) || [];
    const letterCount = letters.length || this._num(ents.letters);
    const historyState = this._st(ents.history);
    const history = (historyState && historyState.attributes.history) || [];
    const historyCount = history.length || this._num(ents.history);

    const { rows, unmatched } = this._shipments(ents, t);
    const outCount = rows.filter((r) => r.kind === "out").length;
    const hub = this._st(ents.hub);
    const hubCodes = (hub && hub.attributes.code) || [];

    const empty = !rows.length && !letterCount && !unmatched.length && !hubCodes.length;

    return html`
      <ha-card>
        <div class="header" @click=${() => this._moreInfo(ents.updated)}>
          <div class="header-left">
            <svg class="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
              <path d="M12 4 21 8.5 12 13 3 8.5Z"></path>
              <path d="M3 8.5V15l9 4.5V13"></path>
              <path d="M21 8.5V15l-9 4.5"></path>
              <path d="M7.5 6.25 16.5 10.75"></path>
              <path d="M14 14.6l4.5-2v2.6l-4.5 2z" fill="currentColor" stroke="none"></path>
            </svg>
            <span class="title">${cfg.name || t.title}</span>
          </div>
          <div class="header-right">
            ${updatedState ? html`<span class="updated">${this._relTime(updatedState.state)}</span>` : ""}
            ${ents.scan
              ? html`<button class="iconbtn" title="${t.scan_now}" @click=${(e) => this._scan(e)}>
                  <ha-icon icon="mdi:refresh"></ha-icon>
                </button>`
              : ""}
            ${ents.universal
              ? html`<button class="iconbtn addbtn" title="${t.add_tracking}" @click=${(e) => this._openAdd(e)}>
                  <ha-icon icon="mdi:plus"></ha-icon>
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
                ${outCount > 0
                  ? html`<span class="chip out" @click=${() => this._moreInfo(ents.universal || ents.transit)}>
                      <ha-icon icon="mdi:truck-fast-outline"></ha-icon>${outCount} ${t.out_for_delivery}
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

        ${showHistory && ents.history && historyCount > 0 ? this._renderHistorySections(history, t) : ""}

        ${this._lightbox
          ? html`<div class="lightbox" @click=${() => (this._lightbox = null)}>
              <img src="${this._lightbox}" />
            </div>`
          : ""}

        ${this._addOpen ? this._renderAddOverlay(t) : ""}
        ${this._confirmTarget ? this._renderConfirmOverlay(t) : ""}
      </ha-card>
    `;
  }

  // Animated "out for delivery" truck badge. DHL renders its original
  // pre-existing raster <image> markup unchanged. Every other carrier
  // renders a hand-authored flat-vector SVG van (no image-gen, no raster
  // assets) sharing the same 34x34 ring/road/lane/streak machinery.
  _truckBadge(logo) {
    if (logo === "ups") {
      return html`<svg class="truck-icon" viewBox="0 0 34 34">
  <defs>
    <clipPath id="tb-c"><circle cx="17" cy="17" r="17"/></clipPath>
    <linearGradient id="tb-sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
    <linearGradient id="tb-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="tb-rm"><rect width="34" height="34" fill="url(#tb-fade)"/></mask>
  </defs>
  <g clip-path="url(#tb-c)">
    <rect width="34" height="34" fill="#333b44"/>
    <circle cx="17" cy="17" r="15.4" fill="none" stroke="#fff" stroke-width="0.55" opacity=".9"/>
    <g mask="url(#tb-rm)">
      <rect x="0" y="21.91" width="34" height="0.45" fill="#5a626c"/>
      <g class="lane" fill="#aeb4bb" opacity=".8"><rect x="0" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="6" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="12" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="18" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="24" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="30" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="36" y="24.11" width="2.6" height="0.5" rx=".25"/></g>
    </g>
    <rect class="streak s1" x="2.20" y="14.22" width="3.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s2" x="1.20" y="16.70" width="4.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s3" x="2.60" y="19.18" width="2.80" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <ellipse cx="17.80" cy="22.16" rx="10.08" ry="0.55" fill="#000" opacity=".28"/>
    <image x="5.80" y="10.79" width="24.00" height="11.38" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAC2CAMAAADnTaqJAAABgFBMVEUZICPX19hfY2Wcnp/p6umji2lkaWFWWVs4QkOdnp+jdzo9QDteZWYhJid7XTL+/v71w13fpDzg4eDl0KCroZPfmmghHiGbd108REV7foF6fYA8Q0a+wMI5QD/VtqV7gIA2PEFAPUC1gzzCvsCTlZV+gYJ+gH67vsB8foC8wMHbe0SAfYJhMCA7KxwwPUT9/f0FAgEvKyc4NC5CNitKXVwqGAgYGBVEKxBVZmYlCQBNNBcAAQL+/v50VS74yG+thlBoSyaVdk7Npm2JjI3+2IuKZja1lm5OQjMkKjJrdHTounHtt1fxyIkpMjVGRkX9/f1LYF0kLDBLXmAdISH/447W1tUcHiD/6KqZczzHyMiIakaqi2doRRr/9rEdIB3o6Ojas3Rkamqnp6fHmFNbQh22t7X+1XYzQEI+MB2HiIi5kljDnGcBBAbVtYtGS0yWl5ekfEfkqkj+/v1BLiHXplX//crnvIXIqYUcJilkOg6CXC03PUH7+/tDGwB1ZU392qRLtBNsAAAAgHRSTlMjlFRta///N/+V//+fTf8r///2//////8v/1BVeBr//07///86WP93jKn/////AP3//////////////wjO////////d/////8x/////wH/r/8B////////////////////////////Af////8t/0r///8H//////8B////kv///xplI6UAACq+SURBVHja7X2JQxNJty/ioKPO+M0+33f3+967960NVdVUN90hZLlZJhADshghLIIfDKgMOiqIM+q//s6prauTzkpQUY4zpNNbuutXZz9VNTJuUWpk9H9/N3FJSXTjxm9PUuPDpxG7/f9jfvqypdvS9PzV0dTIOQIwcuWy+bthcOWvqfMC4FXqymUDd6f5q6lzAiD1xWXr9sQEQ0ZAA5AavZQ/HwQBDcDIvLp/xSOXFCfP82jt6JwQkAD8On5dMsB3l83dluiKRmA0NXQOSF2V94bfYUhuK7XsZ27TaQxPcvVeZu3uTMm/Zv8sc9Vv2w/B9E/qnepLx5+Rt2r/SMkHCWUoGN5qTTwyfABuiDuvQvtT6jgOtQm+Oo7a6fRA6oLoQnklNXcx+62N+A5xCnXUXRxzF3GAJlxgP546i1JqXW99o7Ed8Vc1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"/>
  </g>
</svg>`;
    }
    if (logo === "usps") {
      return html`<svg class="truck-icon" viewBox="0 0 34 34">
  <defs>
    <clipPath id="tb-c"><circle cx="17" cy="17" r="17"/></clipPath>
    <linearGradient id="tb-sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
    <linearGradient id="tb-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="tb-rm"><rect width="34" height="34" fill="url(#tb-fade)"/></mask>
  </defs>
  <g clip-path="url(#tb-c)">
    <rect width="34" height="34" fill="#333b44"/>
    <circle cx="17" cy="17" r="15.4" fill="none" stroke="#fff" stroke-width="0.55" opacity=".9"/>
    <g mask="url(#tb-rm)">
      <rect x="0" y="21.91" width="34" height="0.45" fill="#5a626c"/>
      <g class="lane" fill="#aeb4bb" opacity=".8"><rect x="0" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="6" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="12" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="18" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="24" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="30" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="36" y="24.11" width="2.6" height="0.5" rx=".25"/></g>
    </g>
    <rect class="streak s1" x="2.20" y="14.22" width="3.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s2" x="1.20" y="16.70" width="4.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s3" x="2.60" y="19.18" width="2.80" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <ellipse cx="17.80" cy="22.16" rx="10.08" ry="0.55" fill="#000" opacity=".28"/>
    <image x="5.80" y="10.16" width="24.00" height="12.00" href="data:image/png;base64,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"/>
  </g>
</svg>`;
    }
    if (logo === "fedex") {
      return html`<svg class="truck-icon" viewBox="0 0 34 34">
  <defs>
    <clipPath id="tb-c"><circle cx="17" cy="17" r="17"/></clipPath>
    <linearGradient id="tb-sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
    <linearGradient id="tb-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="tb-rm"><rect width="34" height="34" fill="url(#tb-fade)"/></mask>
  </defs>
  <g clip-path="url(#tb-c)">
    <rect width="34" height="34" fill="#333b44"/>
    <circle cx="17" cy="17" r="15.4" fill="none" stroke="#fff" stroke-width="0.55" opacity=".9"/>
    <g mask="url(#tb-rm)">
      <rect x="0" y="21.91" width="34" height="0.45" fill="#5a626c"/>
      <g class="lane" fill="#aeb4bb" opacity=".8"><rect x="0" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="6" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="12" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="18" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="24" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="30" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="36" y="24.11" width="2.6" height="0.5" rx=".25"/></g>
    </g>
    <rect class="streak s1" x="2.20" y="14.22" width="3.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s2" x="1.20" y="16.70" width="4.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s3" x="2.60" y="19.18" width="2.80" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <ellipse cx="17.80" cy="22.16" rx="10.08" ry="0.55" fill="#000" opacity=".28"/>
    <image x="5.80" y="10.10" width="24.00" height="12.06" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAADBCAMAAADxapfwAAABgFBMVEVjZGeYmZvUYBvT1NW4VRkoKi7q39TS09ScnZ9QU1cqLjG7wL5iUnzMeEjkr4leHjl9gYRiTo2rmsvgkF9hZGeDdJ7yyKIkGSQ8PUG2b0h9fIDHtud/gIKAfoI3PUK+wsa/gVqdoZ8+QUJiH0Hz9fTs7u0tNz0yOUEvNj1JLIb3axe0uLrEyMkBBAkiJi3V2Nm8wsMdIij+/v4AAAEYHCP6cBoYAky6vMMPFBpMMInUWRAbHiQ7Qkn+/v5ESU8nLDEtN0ECBAaam50zGG7d4eLb2+MiCVgcISaoqrA8InRlaW1CJHr21LaRlJfWlWhTVlrMZSeGiIwmDGL6dSYhJCr85s3rhFbj2/G1qslnJ0Nydnl2aJNdYWeUh6zUh1XVYRicnaDquJLCtdgRFBj7+vpIN24rFld6e4VoWIdcSYVaW2MGADTn5+jkmGdVRXc2JFrco3nsfFPlpHejl7gQFBpSVViHiIvVyuf/9NieoaWnqKqam6SIeafwy60nKi62uLijgy+9AAAAgHRSTlNWWf+P/zDzd6A8Uv///////////5f///9T/2b/YFs6r///df/+/wD//////////////9QH/////////wH/sf9GASdM/////wH///////////////8B//////////////9M//8tlv////////+N/////////wJKZ////27///83c0Idk+EAADRgSURBVHja7X2JfxPHsq7ZSXKSk/0sd3nL7WIGNDOSrEGLkZVDbHkD25iEwDMEQsJ2gJC8QEJ2/vXb23RX9TKSt98NOelgx5JG0nR/XXt11cwpOs51Xn335HH2xwiM4yff/aDz7NT+jhn68NkXh+Zn/1jq2JidP/KfneUDBKDzwfwfq1w/5g+dXz4wAJ79+sf6T6aCI/uKAAGg8/iP9Z1ivOgcEACd7wLsH9CfgB9NMYC5bwDmPAV1Xxi+YPqvB4jclf4/0Ifymeo91b0Dmn1FA992DgaA8/PmxqH6RiDDTkA/AAULqNnoi+Q/+5e+qnoz4Avt56KnzFeoyyvY8cfqC82LoG/EuV905+Qv+2GM1V6sLzA/Wg7sIxNCAHRmZv2NDhO3Y2APQy1R7IB+9rL5If4ZCDXzf/WcBajaXGQrVO/4rnMgALww915hj+4AqhuyfIVeQycX5EV6pmaqliN5mDkfCjXgAFoq88F4HzNLV2bp4/uekhFz2YAigQMA4B+nnp3Y88b7/Q/YbymAADh3giFe7G1l2Od5wISNvU9sCShfAtj1sgMSZUc6B8CClu+Ij85WGmb0evxfryVHT4xGTz7bks/zX+JZ9Yp4IF5Vf4t3NloNebn6GPkJ6g098cJrDTR6+Cv5hY2W/JBGT/7XEG+VHyY/WV4tL2rJuxNvkNf3xPvkVS3zueqTxftfU7NpZa2WerbXs19e/d3omfvvOTcmHsnPXZQk8Gpn/wFQVlhTzlevelb9zjL+L1NPZPhRVl1QXdzKXnPeqz8gy9Qbq+vM0BfKz5SXtPTl7oWtlv+MvJFMvd95Vt2qfCGzo5Vl+NbExrBvMndRPTAXyoevCdyzigQ+3m8APpj9F5ABi73mHpmnlgIfdPZdBvxLANDUO3iv+i07eVAAIBsHoEalN+YRM/aWUUkhauOCFWYBE89+srHeKquJUTvQmq6AxSSLK5d6bggAqBmVMQQscLXSRL84QAqg98ymtMVgshlmVR+8MgGswRodk5iBgxwyxJFZbowADAC9ktgM2NIGZOXblZn9sHNwFMAY8SLsXDWc/BbrTyATNqsOWEuF4D4A8lnuKjLrR2D2uxQAUbdDZT9jF0SIPsS4c35fxHAIgClVZqAsg7i1phBjZIdhv4zrEwsCC8QUh1rjFv0mALj/R4zHvTdGPlGJ4UOdUwcIQMCxgG0z7FhwXtqxdeNsLaA+GgQHuCBaEgHkrnFWn+53woIYopP4fve8E8yQwIEJYUZds5PczQAR1l/rlcOOFgaB/yE3aPQDEdtgExyhLMiC/GtZgDpYQF+Y/XvnQFnQFMvvMtCdOhCMvkOEHXN/gR+JoGKfxfcv1qCMEI5dzRj1gAeAAUT3+0ICYQAqSTyFUuwS5k7YDyM6B3gue8SUwHOcWp8nZdoRBsKwDGCxAIDzmb5qivWS2ZnOgVEAY4TaICR7ibaHNu1O/HGId7MAAJWsiakECHqIrarRfaGGBTHHH82iKOFF4CRw7oBkQEX1Ncvq3vUkGgBPFUISkkUVPqLJ+zyohp2zwPauAHBjXgxH2KIqqr2L/fNKR+wAE+Bjgd2HaIRGVBlMsfI0whzjGZYLWk4ETqwXMQxAepET4CQmnwEAfX/QlHCCpVY7A2yEPD5/EAC4+jPSWeI7FaDOCnDiVWTLBZVHz40AdtGIU2JSRNf5lgALmk75RFwRhQVm/9o5GAB82TNdJCMSHwYbi7QbHFP1Dq0IYI78iC8holQDQFQAOxuMBf5gNDp8onNq+WCccYGtucs4lBPmd2neWB7ky67UjONXrMlct5mZb1YQCmCu+GERYmSOAopdcr92DpgC7DOs99U/+XhL/npL/si/9XhydzzRD8eI/YwlIGPvPVqS4969e0t/fv2SMw6jv49uMOKq8bNbGHPWrY4FYRTJTmCEVJHqgHfki4MGANmG19QSXb7M//mj+2hcY3CFVCkibdh73YVqXP7z64fPxMfcBqIa140ESGQGKEsE/FitycxcYPwMDeqV7hxUPMD1crHPu6fdMRgM5I8YS1eDaWTBfDi0QtX++tR++sKf//+ZM2fNsEuvHs99jaL61gb3mVDAytO+oFrLOagKB7eNGD929mYLRGUAoyya/xEAAA8BQDQTalLkxAXgI77a/D/16wyFQABAtPyoRst8VXSvETEv73GvJBC2A0L+9QkAXFAARD3QEHdihAGQ6+3xHwsAzn8LuJbDW1ywoOZOx5j/B+MxNNW3NtdGoy2LwKHO/ssArKRbBbg3BQBQn3kLeOkAsL0dBuCsj4FiQcZKNMo5deIgR5MLQGOXQydErOdipGau8+c7BySEnSS/SRTQvRoTwijJkjGc64hdqAiAVUQBPgSIArA/nwUVUV8I97KdU8DxRQBOAC2RUJHlZZKkab5tJnVoTxkqoZgwdfIYPeXz7oXQyg8qAMaMKhMs7oKgunUcgAARaCHsBtaC+hBzfFVsbzJAZrSM8iTlCLRzcwd39mSMxdzRge0UBmBwmgLgBFNYwAXnhQHFDwbg/2EAfDX062B2RMSJ5uSZj008YOdityEAaJd8/3ME8vsVAnvzSodYEAMnKaEGgIEchAKAnDBAeCCnFs1g9gD45CO856XoPWM0Ug0AA5IJ4STzB7gPMcQEM9m+cWONjxtrN/B4iP5ek1esAwKg5ByIr39S9jEJHIAdwNzMAAeAhcvaLLt8mZtOl5e6j54zL3DNiDhn1DtDVwYBcIECMOeMoxuV+wjsCRF3p7MwKVR2AP8Z5tOMvvy97QCQ8iFJYO+BmTpvqONGIUJ44e71h0/+9PBPD/4kxoMHD6Qrwp4+oRooiUwhHxxaGQvAgAJw+Jtvvv76a/HDf21sbHy58YYXhPZ1f8ZYMNiyWAHQztuF4CWKofAh/rC/1PN6tCUCIN9aluryVJCAHo87+66GolM/ZmNhAAbdn+MpJySohg0v5N/HZEEBGFAA5r6M5QcCNalZxKdJKWBRC+HtPC3SCUPxGvGryMEDIM23THh+DyQQUUOZb9ZLACqRe7p7PeLeof5OL8aEQ26AvKIVAMK3QQA4vBF3xLh6LvpkFoyJWS2o6NO1Tt2HmAL4Yq/zvN4VCkC7NDdwZ/eaaG1uKHO0IKT0cADIOjgrg1VEnOkGEMkfMQC4LGiuHgCgOVquchsFoGwn/vonGIDEUkCSCB60WFGAoo40Eajs+dykl57unG1kEHbGaQDQZINbk0TNqXgGahMrAAanJwJAs/aMegUQOaYWBqDdlhs5CXKeFK+9/CtfMwC0zWXtYh+kQAgAFgzJOQDcd5c8GrhxvJURyaEBiFAAOCfyAJhn2FFHFg0BhSggjoAGIEUsyAJQ2svyFUMCu45NRlhQINkpDgDey+p+srevc7XoyZPrn34Ovgmmn/n80+sP/vTg+qfPkSUsrYoaCqjxTAIL2n+OICMAJGHZq+VvMhGAMjF748huvdKBEzI4HYFFAfg0lqTDrj1Y6Ha73D5YWuL/v/fkKT1rqy5+epe/uNQVV3TvXed+vKdLERnwzTQBUGR9hbPHGA5JGgCSWgCwEN6uhHC7RCpSnhlbYLeHxoIAMBIwrzYP8YYuPMiuVaPXu3btaRWQ/Oled2kBX7jUvfcptr7kdr/XXVg1hi/H62d2bWlQ8aALyBVx9sxH33zzzZdifKP/uHl74+Y778in3nnnk5s3b17EDPDKzZuf3PyEjy/f+eSTm3/bIJLbZMaxskjSBAvepNL+XRkgOZKggDECQL/YHxmcf9w/AFggzMoqAIweKnY5GsIu5GO82l1AF1WXrj7HxsBVcdGAXvHgbfs+TAHc/eBZwrdvHxX/v3VLPT586YrdJd8fPlxdx18+evQ4zQOIaEFarUmI8plMAiDFJLDbEzPRQ3p+jkCv6y2ty5KedpeCry50n1r1pBe6SBLEQH1B5Qs6e1ZHIbFPiANym92eU/4hzaVe/95wn5tz2I/KoWHEJCAsKEUsKNEPE5f7uDKAq08IJkkCUB0XWN43ALAzi2EAwoMLTgnAp49WI1csPPq0utNrjxZqnKriT+sNdYPCEhMOAPt6zg3Tq/ENef7SRVcQRykgiQz9qgRAUkDR1p4L9XI+NiSwu0TRgBoa8uoyDMBg4CMgAHj6CHvrVlcX0MouPLqmFuN5cP1pbEcC4IXkz+gQsQCAbczhVypJ/f4cdl/Pvc9qAHDsrhD3qTiQpgAMQGUr5w+NV3p3FTzCARkWyPEzMkB4CxxmJAG42l0Y2AAlV264mnPBbO+Frtoo95ZqNj+OB6jVPxuICQsA2OuUBuRzFy+dQYjNvRFQRMMA4B1PuY+mAgKAfqMER3iJTGxyvzPjwJcBxl9Dl//0YOltdvcy4vlPrl0F+PyBEsnSvFp6Ij7+Z8rHFoRH2+Vbq3+WMkDFADAEKiigFvvKJZI7dPgXxgUwEgzKiQQxAPrtEPdBZJCmdQBUQlgxp70EZmoowJHCcRYkAOj+23MUVe9qfsM+1yqpeIt4ErpERe3evf7z9SdLSy4FfPKR3v/BvCAJALt49DB6+syl97kARpfP3fyerj+LAZA6LN9DIMVCuGgnSG6n3FW9NxKIpadDnRAeeAQwWHj7LbO0q92eUY+zrtnfl+8KAkBvXfpKLQZcp7G2CoCzZ/2AMH9CA8BuH0UAfHTr8Ce39PKLX3NCNyVxYwaMRYRwYpYzJRu/2uUuAFoy6MDM9p5IoOaARpQFIQB0ahz/fWGVuKqNPmt4zuA0lwL3EAEs3TUwPe1SIfxJWAZYCpAzfmPOhO0xoci/L10kRwBMYjOWAZ4LLqXrbz2kitEQACpJkLb7KENl55roVIlZFAC1/BcWyEB8fPUecQWsLiiZPRgsPQW00Av3UPzn+lKIAlRKhLC15pR9JXn70duVRbcxZ6wDR10SIsGJkKFTkpIFJdMBoIMvNxAASASY2OSuSaAuKwJCLEjteb7h736Fxt0LFoGFfzK4agZ7YLTRhbd+RgQg5YTx5WHSWNUUoF0RX268885NMTbU+N+/GI+05Ppu6kSlqXqBf+yK6LdrAmEpYkF6kTEL0hpSimKTu5cCNaUKalnQ5evU5fVvS1YFXb0n3XBd4W3rYtq4gFj9wgWG0vxxTL6yhOX2PxsKSRoAvn99LqCqKrMAQvEflwUl1T/fJiNkQVmQERsmNgm7Ds/XnBFzTzsYX5DgQUsOAISLX1i14wLOX8G+i5+Jm2zsAGCk6eGNuH+TI3DpjMd+rGEMpDxaCIAIBXjDBwDhRjNUlveHAgIp2jokqZaxe51mot+P+CkGauk90+1093MaYFxdoEL4LF5N7wiLcTwfv4S9Qo5jInBOhwCQ1IbkraPUFcKu95rHJisSeKWzfzKAhSxhGpS3C/igS/RSeoQg4MNbFamkeDXvVmZ0ICADXmVYG/u5eMthQXM3oyeSA0I4CaAQeMYC0G5T/Ugwq7I0JHCic3BnxOIA8Lf9aSnmXBicPj3wvUcLS0B2NntSDwA9y4VDX7dvOQrQ9/5xPpNrhgFI0qkHBqAMCAwem9S3M79TEqhTQwMUYHazZEEoC9ECMDg9zVhdommLigIG4aB86ESeAeB9BwDhgnaO+KOE4Wg8oJ4Z9REFUCKRwqBMDeQ7PTfpAxA+pR/OC7I5DxULGvixGjuWLtBsdnzYxwAQo4BI4aQrl1wVCJEAeCWnQ66IiflZlAIShwKkkO4Zr/Sxzr5YwoHSCxyAQbXDBy4Leq9r1//tz1fkeCp+XbOj9yk1AwgA9xYGlbLkB+Uj5+nE+h8+4ylBN8NJKUEAkiSi91hJLAHYRiwIX6590zYws9Nzk3EA3AJgFQCnCQDV7nrbUMBgaRyNni9Zo2DpAUle/Lx7evqsCPu271+/dfZs6BglCxy7ZnWWcCQ9RUeHMQCJn8DIAzNNQwI7OzpcI4TdKlFYCA+WrtMDg88rf9pgoEwEP20ZkK7JV/keOfP8YKlafzc18ctomRwdgQwcYnqDMZoxagT3lCwoIQDw0OMEAJL+plGEXuxICkxBAZUVb93RGgDCg+4taJV/oJ08oX4PbyEMtSmnvu+5cpoOAunpH72zYYfwSPztDYMbjYu5rgiqurpB+elFAJUB7WAos8jNOfWdnZucqIZanajXtVp+BQBzDYFBZeQa1SXLxlevyouusmtEk71mDe+vLnveUHJA4JYe+nyA/s5vvP1fGdCHL5KsOZtTvRMh7KQmGgpIvGtEbHJtdxkq8YpZtb6gQeULMopoZpNWVnU8RqUAPTJuofw69bmpVAlx4SqxIlwAnAD93Bv6K01AALnjqosuHadSmIUjYkmU/dCoJLaEwzAVuQFgRyQQPKLkyC+9T8MywPCgJ5fdLBSZp8VDYKu6AsGjqygFVyJw9xpXRp//TENiEQCMf1RwePGVF+n6f3LJRgdUQCZQ0CbgjAs7JJzQfIQF4SQWnRmlz02e2xMFgJsLLgEg/MMBgL/jOQpriaUVH/L8CQpBdh84bmceJOsu3eNWw4KbFREGoDopLwHgBgAOy/PcoK/nVNAYJQsx94zA9CzIB2DRowBySdG3pcz2CAAE3KGSApA3WbAgXHVTBFVI6iJf2tV72PRSaRHXHKfd6sJqJC0ldlJeZ0B8T9IiRHYcu3nrLDIKhDkA0ezoftv4gZIpAXBcESZ+b/wR6yZJa2Z6BKKFW72jt/SIkpIBtGTlV9QdQcJkpy88UmzpSSi/bhBISzlz1jOxcFB+gyRFHL2ojTKMwAat8YqrJjoUEOBE5HxAGvQFOWyqtKfn74jT8+d27YrAdfvQgVNPBrhaPkQSE9X6P9AM8quJiUEVAOH1VwC8EUgLEnlBJDHotlffMcCCkslCwAeAZlCnWgwbnWv28audzr4G5ZnjDR0oZxyjVUOvLnVjOYddE4GHe5cDl6wOCACHz3g5KQYCsa6/kPU3QZv357zIsNO6TNYL0t5Qk4VSF5cMs6AkSd0E0kRF56FqePjtdBDUGWK4DEAoHuCRANcnpUHleZ8XHj1BZ6u/8mAadN9D2dGr/yUA0MkOZ0Ms6OKliPOHEMZZo4w6WhCQAxqJHwvw8hNRcm6JU9gxCCpL0VY2vvMf5zuTOVG8eLfn+br2aPXChVUZbrxwQag0gcqt3CnXXfVdz49+JuEzrBsNNH2sdEXMWH66LNhUUzHr9pWjt/DjSygCsEEQuHX0Sig3lN/EqB/IfUic46lmcQt5ShLLAD+Lut93S3zOzv94bCIZBDPjAHly7MGKlby7ZDzLekszD4GrD7haSY7Ud7tPnjNaAvQpPqAhTgcwtiUKoukP/8vfRBLKLVko7tZhejrg1q2jN18/KrP/9fGAo8ex9/nmUXvlrUtH/0ZLX5i6ob28CJyQSYLylUd9xTlhBcAoD2dT52Wlch1HDpj5F78KCD7eCQCkFg/DAcpMpJmM5XiejV0dz3iIr/68KixfUcRArOjqz2PnLJc0kL96xC/h1hm/5K5MpBtfrT7+eXb84tTjl1+u0N4dv/xCXqbxDUMB/KR2X5zULuxI5T/+K9WPCnWUuyhyGfG6ynND+Qfk/Ig9fZcYeWLWLlvBLrD5IzO1BYUirghMCbEuqhDpriIwuPbeg7t8/PP628C8liE6T/1TccmT60+v7leDnlj1ZE8LkrfwU5FPO1JV8Fsm57IGLx/Rp6Ps97ftLJu8pgSQNtwSguXlnRXvpqX2cHVoXDrWDZ/Fmw6QY8E1ldhdF5rbnIa+5lUlcvaKd9oWVUth0IwUb8qcR/qDV3SpoUVcEoHArh2uY6eT7ixvw93ZafV0tyJPoJxpuIo9ozXmAReWCSMASFUkPkyIHUjFtaonFpV1K2btolOXmvdKNk01/woAF4JjYZUokp4ebFoFpBOqU66EOU0EnOPsdQ15XKgdceHXKoz1XJ4CgHHPa2PF6gpI4/ILGoD4JTrxYmXMwCvVOTt/5NUQBFM2cgOUmVBTyx6CleKcN0FNPyqY3JSYUPzEhqOoE7CEHgHg98uGcHIs51XMlKthE6v0CwoI9vSePTLja6URd7RX9pYy03A9RFxo3VZUcvsFe62WnZ5pUNMZa5rGNjWNInwAIsjTzb3F5XCDTWZBrGrWN/Yb72kIHksIlieWLAsCEG4mQKUkYB5CW/AgBu/1opq+hlt9HXGI8u8AC3LbqQApj49cke1capnQmE58NFXD1bDOMXvHoYKoLyjc9Ahqa807PbLBa7dDHwPpA4Yr3dfUhJjUXgiCW8eSbhgAUmeHVLUDmQ7aHyIWNAUAEKwaHIKgTg112uXU9utBApFURa9fqmAbo2CvDuYUcbErRXmW3+qNqslRCoBQu3O2cwCAAICLcCNGhDJXYq4I3JWTFoJn0S1I26pF9ym4bbWRy6+uVaXfH5KUoHCqmNHVZG7JsnhbCLfOlgBguDMAxr7+QjnRvC3wFClbyTxVnWSoRFUhUrVnCoYJwXTPQLmhQFocUDvLPsZFFV0SGzeyyRLMKX/KAShHO2NBgW4fBIJ5c5IjWi8IHAXH04ohRPR1Te8iu9op0x4qAhhsvWZBRiWcSInAUGqHWzmXFmVAJV2QMegAADuQAaYnlmupmsyJePn6ELMgRWxCfdmcbjuBtneefoBahmFnB15XcLP8aTcXt82XZ1whsWTrhobu3a3er5avKDAAMKlFowYAAp4yBMGJzrOa7GhSONdvMxtr1+O3YAwoQLSRGHEhAVKdgKrlofa/qNY7birDQu0w3GOq7uKDo2q5AGxiFgTTsyCv3R04x8kCQhjL2kBDGW/fuA2NfNBR1eJI80LAqg0Vow4LZH4HNld5jfYD8wEAwmXdIj36SQ5A+8ZuZUCQEeo6f8t1lXPD7wR3v6N+bqQuAFWlMDUF66oyep6XNjKItNwhrQ4cI8rJrLT3bTrp+Ydo6HKhqfAycf2KAqYwQTwh7KkR+CBBODFrkndqqkZoNe2l2MQOOjEpGmkBNuGOLK02DSMH39ZwOjlXm2CNuyLWIxQQAMQBILSPUEPoaEAGWyYxp2PEcIKd9GCxX7ibFmVQ1+U45HEjLMgpPxqwuNUVOiQwlQwAlwX5vJzh83zx2tG/x2Hb2TLaFhIIahDsYBe34aAGANInlPIgWVkiIoR/3wAQBYIawVYSu26AOiEMdVoQi0QPOAAf15yU/10D4IsAKjNxgyarcezOGec35qkH4F+FAqx2RrmP75MzT0/SgsIsyPs024EsxoLYvwYAjPTPdhvu2sASEAqAiWEIVwgz8CyLCoAIC2K777T12x4ZM2ooACNeDtplmqEC2hapnRtiuPE0aedUA4DS1V7r8cVstVo9+U/+8PGa/n+v1xM/6BX1dCs0XvOf6pE/etVHvoaf7kXe1Av8aolb6fXshT33rfzjX2uIHjDWDnCdhwwV7feq3DA2EQCgviDHG4btQlbLgmib8oPhAwf44ZNMBMKCQjYOuO1ArDzenSvCT7+YCMDveVAAgIpjN7Dk5JTtFADwLAESN4rKANprB6sCMGGXOR1MmJc1BkTPRv2VsDuHHNT0vDvIFwss3DjelXnYG9jE5iyQpCeXOJ1ujhOFMIRlAPhBsVpDDAI0iFxKU9D5VIySmj4EJka7/uAAAAPXhEJWk+uAdbwLHgVYLg11W8pcM4kCICaEUVR7agAAd3LYD+47Te4f2dROn/G6Huk0BIF2Pg1rEwpwI6DgBkCYF6qORMQgooZCsGcdev8UAEAw02Pi4sPkZMFwWoLv5WRIU586sAzBVuS0cGskBEp6MqGifwEKgMAM5B8KABxqIME987VxV8SeRTFMfUVtyxGI9gUK5a0yr5Ue83Y5s+cDiBMWPO8QNgY0Ik3ZyhDlLgZJgIQkwfHuESY6UQbALhd/wooBSVb3/NnOck4FAT1TjhJx/JRU64wLrTyE3ELVT6vhqach5dXNjCNqFk4ujgEQCFZPWO/6pWbTZx3W1W6HCbcAk5K8iDu6jpUwp3ahXkRNAChBHMIWjWcHRFa1lgVNsfyBPvGTSCcQwIF4GqGTC+yc2cAHBBjVmUhmE3GxxRs6x9Jh7UK3zLq6EVOnhSb1hgbj/qjlRl1EbHqujoK6MIW/0EtGZtG6cE76XCBdGgIlIfz0sUkAUEYEJDoOYSUUcJFVtGABd3Rw1AvhnaeAg6u6xVPFI0kDLNTz0wsoeQQQjXrgiD0JSUIwZxjc/rtE/GQNiARVAWdzVQAE5n98Y+O2A8AEIRxN8AQIN1GFUMc84uL1VXvAzW5rT6ngSWJjri5k73BfG5IEes4nILKdzwpQDlaRUE6YPKQHQCWkqK4zd+vo14jvTraE42noACFjKBj8RwYlbie5k6QKJykXmJNFW/cOfEANcFZEvWHv4ZhpHTSS+o6y6vQpSZzcBuoIOT/1f/SKpbUpAJg6s4GWVvXTC5BeDrSQ586yXdg0ySp+MhpK9LSWMDECHNXDy++DRs9lC/4eq4hspWlzOa1MuSkqLdz6xa5xNCg/raXlniyJni8jaYok7Q6lAkcX3mvDbVO4INDKnB6lsroaEDsAIGYOQjBpWywqY/FESwyDBAC84xnfaArAAHwcBQB2c0ha/dHbWhuJ4+PpaG09Ay8xh2YgBzJsrQMM3N7c5DU2bW4YEf3YFeEJYXC4i5VOjUaQUTXWtzdHfGzaqfoHtfU3f3/z6K2jt9lkACahAM6CY8O8sVk6h8zba61wCi8OEAUbdkSSElnAVVeXEIccnn5uqFUBgv4923tppemtxspm35nqjYZ7SI90sGa/vH8Rn3KLqaEROQC+CuTYjY1NcRv9frtoi3/iR8GxBr6rAaLNzeOMfIeCw6uz4J4PgKm8e4oAnGszNddSTlMWi/iLhGNT1JBugO/NDhwz5AAcixtiO2ZEK2Kx5b209RAAlPyfuK9xqNV8fJvHH+90MKLzeKmJAYEWsEqazgHVBi8z0VfrrmaqRltgUDSY61kHP0WlXgYAROQNuAqEGS1RwaLaDvJ/igr4KIuCv7gJ1BAD/0A0DkDtZuWDJEIaGQPRgih9kEYnDh21CAE0+fKXplpKtf5qriWfarHunUL0z1xPAQDUu+YIACNBjmV1LyUfooaIeEbfIL+vLeb6BUO731rUbGozwalMGbEetDpjUxNJpgjS5WkURZZJwXLsIa5X0xYkLuZZmu3GKT6FSMyBEGZcCIMTkK03ATj34TuiXVZboLS7Q96bulEOQQGsrlklClI54bEa49hzBwSK3eHDIU5MmMgX5nlS9d/Zij32mFnmYyanplrtQL7nZDY7805HOpyxhgK8w3O1yj1Pn1dbX6w3Vz+rGlLDRBQ7ald4tEXZo0D4q97unSymHZMgbKsx2kPG1apIEIcenLIEIF5+U89VctZCFM4aVlW15Pz/oubaV/WbXKvUo4AJqYmAgyfIv0iRTPNSrT+/J1vKFPWXKCoiyPNtFmnXPYUDYidygewRLFpNci7Q060snFWhCaBZATASgk7uNT7VYbX4puWkwEBTR543SQkQv8BhXXo6OH3QGHiuOXt+J1dfym8sHSYJaewh/+SEUJSVljAKJqyGFE9vU9cfunEd0YBOu+D7tamJ4PUECp8sBm2EgdhrfcF1xE4bDode621BDoUiEKH7Nbwck6kACFFyyAOvn+6r9edfmwyHSeJUINfF7fh9lYpFKQQgKocJY5mGDQF1apAbD1QEMhWzgKZgMAj6NyojTI1UKf6l3Gle43k1WTXV9l8EAhnVYrwzSrJmRFgLwuWLiSSnPQX4AUJ5T3z9U7kj0qrBIq0sWyEgNsZDViNfnRVxOnFOdTjNKfrrSjQjA8hOcrPEsNfcGGGc//SFspGOhkkSaICuN9swldJYIAD15V5mT/BzepFTkv7xenDLf4C8Jyl3y8KwQ9Pr27k7eVsSgS1WGwILMBXGpjr6BzX6Z+CkvJ+uE0TZvGErl5p1mQyT8LBdKMu+tEHzvJe1Mj7Er1ZL5GeLwou4YsGxzuSW5vTsNvlzK5e31C8sQ0w1EZgbsu1hS6kr9/NmoP5E1BD2+wn5h1T9Y5aBFXXK11MXq1tjHYtgTQCZmms7iS0/kgW8x7BGwB+UHo6cn9RLEmdS0DVgooSm8DXw9adt2ZPEaUmqRZSkgXbexzbxFAyeOJHqj6riYHb442xeEE4hhygABjAxV76FSFF13PvccF/5sCitpSZNNWkn9PsuALPvagD+8Y9/nPNKFzPSChnfpnqiLxRQvv54m7tVf8lLykGkxUAAAObWdsDlKWJaoit33RoqQY6CyvgAC3tDFOIVAdyQe60greZp523U4lkgQKq7SvOMA8H7b4+k/3o0KlTPmZOGAjqdV2fdAiVOjgeRbcImF/Dy9U9xoXGhDrdlNdMCd2dPNQ0IZSiPVR9kVCkJKTRxFYg5joUaCmBOawfvJLsXChYMSK4/2V9DvqDc+yMcwBQNrnw7CCg3xVDUWFeipNS+GQHAs85/znz44aFDtMyc45rCadIqyU8qQGVB642nwlFYjDY3R7yeft6m1eG5HJBlftthAGilAwhVDZjiwHw9nyK5oeDGXXwjTBNAP+eaZTuhZdNTvvbp6OHmJm9fkpdVi+FE99bQ1ikGwHYm40KzP6oA6Bw7MT/LR7iMDA06M2oBF9X6V3fF1dI1EzxqrqfyvnwEfmI03oW8cKw+L8LrFF8fCnMFB3ZFeHUqXO+RJYCtXDIQY+KLP/hUH5oq0cfXuZLqtLYqHQCKktgPZQVA55X5UKK4V8kOywMwBIAlD98S5ZYTuBjmBe68qCgz70fLMLlFn3Dz2rDrGdvoEG3CRVqYkIJyNRiaLEPuYy7KlHD9fv++k5G4mZcYAIcJSQpAAAwrAJz1Z677jqYsWwf6qJJKRvfi3KdqZgZXmtU7f+j3U4KAJIEVFkqexy4BP4ITJQsnVYixSIDMEcJuLTrmWxGaANZzsYG1x0euf5FvmjVqLuq59sqcmKAFZkKKBQUo4PydKSqSU5+v/Fu6oEu8J0q9rM1MnVntZbKwPxQ5YkHDVJJA4QWgPBOUMkIWz9qNCuqAIFE14yCAUdgIUzYLLxxatLX4VRXtlb+ZT1UcFhUHYJt6VxZ2/Ydp5STTCPSDAMwo3t9YF2Nra+vN+/fffPPNLTHuNxyFHdnRgisaAkhUa3t5E81eI8ua43GTW3+NlnwqyTFzlM7EvOkVUyOpyAyivnoAR99Ed+eliHqWGy1XE2terV/TCekZD4C1i6E1aQrpaONT7fGpchLgdm5DYfUwx2qq8Fm3LQb9IAs6qf1M3hBWQ4M6LhFPKqVYQlyxUP5Xvhn4TWWjpCcQyNR0074FQJPADbfJV8ilz+KuhgBpsDrPHk3OBS/kxgK3UBEA39dFYU173lNpxU51vJY2FoWrodES37CZIwCKksiBMAs6opicb1tztPoFSny2Gbj8DWOua0oVyACQ/yAzMsRNZbCd5yOQXhDlylJNo/QHV2IYIMjeGSkg4JXA8oo+OZUygYVCMoxRSziIpStdeloH5SKYE4Axd1KpwY8bPTnVH0QEEk017VugEh2UreQwAaBSQ5kKagX9G+02C55hFBzIIKq+Tpq3vEdUU2z8RR6k3BJ3xdsfyNvq5fa7pXbQzzMW1Nn9Yn1e1q+TwWVDFRANI9s9NMYHNEImm9WPm0YEy7UzrfPkyo31VJstkXaTyblKwKBv3TCcBGzOROGooaIWLAIg5OLjGgs9BYF1IMHdEtNQSzVSXGll6ytNwRcbK4IzNrPtFV72QFBmH5mPwisqdpHLQJyEC4gmnpMTwIweCKt1KpnCrZ7HOxBSyxrH5SdyESx8cMbfILzMwNd//aexIIHGupxqc6vRlDJDcBNjLhAA2hiAlALQT2IA+K1VZSdAoRgLuZSgPopcEN3ggV9JAyC3Bw9htGResd0XUjngDqGEmgKMwsBCGYguXNYqARYvRkd3tgnIgCsHCEWi6jRZXip7Xy+qjKvyqXI2+xOaaiKnKtBVxqk2h1HcviCebM6qpmBBBaMR2Wq3NUViDAK0KJUA4LeRv7nIKUA1aBEpBK1MZtVUJKDvqi3dguRIEU0LjWWu+PF4xiYkTTOcH2SrJsZz89TrWUPl2G7mWoNXioSk9WajN+a5cdt8qqKhjJpq3mhKz8VWnqSVY74oq1wp8YODyFwxmciCEkkB2ElQAbCSC9lieV1fWGBC8++lm81szMlyvTGGZvP/DMUmESTQyitulQ7FXfVzz8KLxscYRPNNog4IX4UKUUCdG0OEgsWX57n24igjTBSwZLyQTDNLRs3mceitb600IRuvp1tjEXoRJlJRGWxYD+Juu2rHSnzyZDIA7YIUd7dWwH0pAmwUTOjFfGr8tsaLzcXWULC+dEvYiFIZbclGyEg7a2tLgOadT6xKyaY71ME8+c78gMzkkhtSreb7udRuICWHxVR5+b5MTTUbiVeL7TGf6qI0fYQiVJqIOG2V1S80FcksnR9kRKYegDYjqQVGIdrMZRjeeED70nHIAWgJvaDdHo6Eu+++1A7EXRkelKaVbiBsDL8dqH+EmNQxd88BAskyrOdA6spxLQUgziYYZ5X1If2glbtLTFWEGsVUm0U5HI2GaX9N7TRF7WvW9Jdp+puba9vrK9xYzvpVB7K8r1N0Tk4EwI2cgrLbiBlcClYlDGAplEbtobir0bDscQulebyZCYP4vlQOEq0bcEvgB3qOnIEX8XRKizk9tICcawG3uITzwJQq6LVClb6kR6FnK37xPysRLAMBxpAUTIHxtZeWPmy2+Tz5XIflCvDZCxrgU/0pr1ym7dSlK+f41uyr9QCUXpVtNZdCBuOt4zWVpSyaK1wMLa70ubd7KIM+24zf1Uqz2ZJ3ZZ1ZIi7D9SYnax1ofxSI9GKbkKnuVPl2299wALLJg5OyPOoIIutV8A7jzCoF5+6JqS5mi632cKTjWzcYX/+VjIsBKe/0aLcnMDoeE9YJp3FDLDTH6q6QUQeNMW/P2GjC/ZIvv7yxdBOawJtfNsVdreTGPhTacZFvxbLxnfzYkB0cciZEGUogLWXqUz8gZ1pWJJCqqbYWuQ66sgjrpV7/UTriU13Li0xMNcu1CEjlDq4ZvPO28sVt5sgDMVTDUoA/s00uZkY2DVTc1WJrXAj7F7bbQ00BHIAxD9wLy4BzqLxS5XjSAOdB+ZueyzUiRkmQCGdyUuWdEd8pepWIkSkBQAaxMoarPS2reGeLPBh2H2C9XQGQDMew2NZTbVoKqAVg9ghvcDjzv2R6f66TXoRM1+crRNgyrXv//Rz7lTgF/FRyxYxvC7H+4qe4wbfFensNUYB25spzM3s8erG78xrNlR7b6fkOHtSwAIip9sY/tcVUV0qz1wQFrJebkgVZAEplyR758cfvZmb+fmeWDNXWTXtDGwkJ5kgq4E81pwOgUDJgLKRQM2tXNNT+iUsm4KqokAHK36c0A3GsLW38j9SMg/FuisCsGIe6EHeMaxrNsWj5KXNEBcNtv8mnushNn5Ykdq1vJAqAWd5TWIzzv75ix7EvVDOrmVfndzsXvaQy9CMlkxpwv6/WvxxJzbip1FDl7RC6dP8he9lGZgCQhrCaFZ8qN3rl+hfpWE+116y8QdJAlcbW/K+nngU7qYq+kjOdE7O7v6sqFUXEAjLpieb7Am4Ig6PoD0UnWKUc86uHJe7P/pINyAttWcmpNnvK/dmEbZkVVabZYjVVbfIoYadSoHh5RNnC82M6dBOfc19MQGB23h/qHbmJBwhfXFPGJ1qZEAN8Swy3OENalKqxtM/7JnysTMCXa/TLFE0VVNRJTPWHEX9hm/siJFPiFMBk4zednKlUPZWHHu0nfO6LF/N1kvqD8/5QulNRGn01Ub6g5la/5LYAd0/JSN34Yb49VtbhT7n1W+gDP7Mvwbhz8qSc6qgKsyTStuKVeZs822DFTpUrppva7dUwsjFVKWi8W8y5upbmy51jP85HRqgBKx/n56kPVfOgHvc/5zdUJEb84nGZnG8K5R8h5jXfFt99+OFnn30YGp/pH/tYPXOI//HZIf6P/+8z8eRnkQ+IfWrsav1xPDcNDfHct1xyHlEhcJP5mssK1L3FkYr6NZtXZeRDekPlWY6RmaoUGFWvktqO2vx7wkO2ID63bMY5+e9Z57HSDWx4Z1M5ybeELaYj1dzkbOejpvRGN2xITPFFcTrhNz/k0hxR/ncT/ZMBMT7V9byvgk8AKvTBDU5BAJmdqlwV07BqQkvz2FgOPdV5oSLz1h+X92REjAsCyRu3NzPhAmqt67i85VYqoi0FkxnL+kc9WNY/1QvL5/DLZOjXlp0nvMvOLR+zLy+TS5eD1+t3nTq33Dmk2G1hIgKytzCn9obMO4CtzUwQQiamKty+iQ1uqanekachJwHwsb6p5WUun5eNpI4Ij84ryoC231W2VaBa8h64n+fDRe5R4UJZrv+W3RWKLNmROr74mxq/zrNqBtq87aucCEHjrUUelC/GSv+TU11HUy2rqS7vgQIiCNxRiqiN8MjTX6CzIvhpztFY1I2XNftFTN5yoLXJZPmbGordCpWvijTKWBafqlBGBQDSCGhJ/ylfksKd6r8fCAAqlboSrZIy11QkW+Zlbd/gm184fpvqphBQoDnQSwPAd9pdlprjV2qzyalmi1ubvbHJzGr2295Uz9futd0CcEzeVQOlIWmrg/NDvjMWF5st1bJCyOoyodKasR87Lw8AX0getKhsMcWG9GHPTBDBWOgbeqpZXqautnGofqq7A2BZKwcy5y2pIi2mRoIyCpvq0XaOEpIKvSt+fXkAONX5cdZx2fOpFouBqa7LqabVQQk11WOnDgAAflfqPE1TsrzUpGyve/6KAjFFvitUFOBFLVv8rQ1FAqxipDI+3M+33KmORzk+FKQumP1xwlRndr0vjuj9XZ2LlFkYeUHuqzFEYRuhQ6e4j+VLQwJKE/0hN8mJ0qfe3gJawglzg1S78icKu90DoNQzHh5Oq5MjivD6o/srMidxfZOfiEzxkZ62zkU59FKt/6mOMvyFHEalIcRUh9s/CKO/sb7GHxTmjKLM1Vfulu86BwVAtS9Yv69IwJ4HFoWjRAGnfkGPS7b16bw7518uAE7puCFr980pMWUYlzbhhJze4+CoMpePzx8cAJWC3FSSnxzdJ+f27E2pAxyzf33J1v/cqc4J7ZXu+wUK0sKZKjrAMQWvndmzfiYyN9LUL07gnBXm/Gd9Sqr8LTIhdY5orPMjkroh1n+LTWtuzuwDZfLAu1OWIHBT1QEmrhY8O/XyIXBMbTbo5zYbp+L4/lS1MvhiiqnO7Adv5JK4oAUT6F0JpUDz/9kTnZePAAQTqqY60oefvRIdVv/MG1XSyRQfvScAnlWCmAfoy0B1ArQnhuwlXn851e9mq1B4noarpGhTMzXl6TsHDYBxlHA2xLMVNbP3eCTXRn94ydcfT5XnmpUpLU6Clr+yRWen1PVm9npb/1FFlFcKcyzeboqhUNXK6kgz5/8v7fpzGpipQreN1EKQ2vlyPaNfVcWbfTGlrj2zdx3ZRJRXUlHRFJ9VFopyumLKE3338i6/ROCYOVPdSORU7SH1VNQLNSVbJ7rg9hEAro0+NmkVze1U1VSWBXJE+ui2ye2avfPKS73+Uhu1GSTjraE0OPuiRq2YdLptkx7nv516qjP7cVsforQKaGxtyjPNo7UtnIY5/+P5l339uS6E6F1YQOtrI7H7R5tv4uLGsyfOT69qz+zHxugcOzIhu2v28czLvvwVvU9MZOPbfwdzndmf2+p8+7jmvmbv8ByIZ7+H9edx7PqpckF3fkfh7pn92hmdb4/MzkZyu77t/D62v5nqi/ngVHnG8993ymhn9m9ndL6Yeeze2Oz84++O/a6WX0HwxcyJwFT//Vhnx3Od2Ufi5OL4/Kvvnjx5RFeROnny3f+rc7t+V+t/TqWy/ZVP9bhefD7VV8/vSsv4b8KBb+XFruFTAAAAAElFTkSuQmCC"/>
  </g>
</svg>`;
    }
    if (logo === "dpd") {
      return html`<svg class="truck-icon" viewBox="0 0 34 34">
  <defs>
    <clipPath id="tb-c"><circle cx="17" cy="17" r="17"/></clipPath>
    <linearGradient id="tb-sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
    <linearGradient id="tb-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="tb-rm"><rect width="34" height="34" fill="url(#tb-fade)"/></mask>
  </defs>
  <g clip-path="url(#tb-c)">
    <rect width="34" height="34" fill="#333b44"/>
    <circle cx="17" cy="17" r="15.4" fill="none" stroke="#fff" stroke-width="0.55" opacity=".9"/>
    <g mask="url(#tb-rm)">
      <rect x="0" y="21.91" width="34" height="0.45" fill="#5a626c"/>
      <g class="lane" fill="#aeb4bb" opacity=".8"><rect x="0" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="6" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="12" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="18" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="24" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="30" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="36" y="24.11" width="2.6" height="0.5" rx=".25"/></g>
    </g>
    <rect class="streak s1" x="2.20" y="14.22" width="3.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s2" x="1.20" y="16.70" width="4.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s3" x="2.60" y="19.18" width="2.80" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <ellipse cx="17.80" cy="22.16" rx="10.08" ry="0.55" fill="#000" opacity=".28"/>
    <image x="5.80" y="10.47" width="24.00" height="11.69" href="data:image/png;base64,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"/>
  </g>
</svg>`;
    }
    if (logo === "hermes") {
      return html`<svg class="truck-icon" viewBox="0 0 34 34">
  <defs>
    <clipPath id="tb-c"><circle cx="17" cy="17" r="17"/></clipPath>
    <linearGradient id="tb-sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
    <linearGradient id="tb-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="tb-rm"><rect width="34" height="34" fill="url(#tb-fade)"/></mask>
  </defs>
  <g clip-path="url(#tb-c)">
    <rect width="34" height="34" fill="#333b44"/>
    <circle cx="17" cy="17" r="15.4" fill="none" stroke="#fff" stroke-width="0.55" opacity=".9"/>
    <g mask="url(#tb-rm)">
      <rect x="0" y="21.91" width="34" height="0.45" fill="#5a626c"/>
      <g class="lane" fill="#aeb4bb" opacity=".8"><rect x="0" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="6" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="12" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="18" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="24" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="30" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="36" y="24.11" width="2.6" height="0.5" rx=".25"/></g>
    </g>
    <rect class="streak s1" x="2.20" y="14.22" width="3.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s2" x="1.20" y="16.70" width="4.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s3" x="2.60" y="19.18" width="2.80" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <ellipse cx="17.80" cy="22.16" rx="10.08" ry="0.55" fill="#000" opacity=".28"/>
    <image x="5.80" y="9.91" width="24.00" height="12.25" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAADECAMAAAChpwZDAAABgFBMVEUfJCqfoKJcXmFYkqsbVHAVZ5Cfnp9dYGClFRfR0tNWIBphY2ckGBXddial1ubf3+CgoqQlKCzXtbKUrjOLk2vi3deRdWnek1VAPkBXWV4CNlbh27CkXin09PTEDxR2hW83oM/AvsBWqdE9QUR7fYB5jiyrsbGAfoGDrcJ5xuNwSSzlgza+wcM8PUI7i69+goN7foG+vsA5PkE8QEIsLjR9gYPEf0t8gYIiYjqAfoLo6OctN0D7+/tGRkc0NTMVFxZaaWnHx8dTVFS4uLgnKCgFBgfW19aHh4eWlpY3Q0ynqKhzd3cBAgQxPEVmaGn+/v4SGiMaJCv8/PwhJCmyxs7T5+/8/PwBAQPV9/0BicPIExiOuc4dIidAQD6XpasPFBkhIR6vCg65vcHT3eI9QD5ztdKx1uYEea8JZZEkKC1QAADl4t1yhYy9wL2SxNprmKxMeIvCwb1Qp9ExdZPm5ucNlMklJyuz5vT5+voDhLxtq8gumsp5fYE0h63n2NH///7OJFOUAAAAgHRSTlMZYVL///////+W/6H///9wnkr////2////Nv///yX//////1Ne/xb//////5gt/6SkX04ypFj/OP9O/wD+////////////////////Cf//1f//rgH//5Un/////wH//wb///////////8n/////////////4v/Sf92////////COD+PJAAADcgSURBVHja5X2JY9RGsvf4HHAcE1ibADnItefb3Xd/h9ySrFsjzcgzZoy9wVdsQ0jMDS9kCZB//VVVd0stjTSHscdAKo6PsdFI9eu6q6try0Vqbvz0wRJ7Y1o6n9Ff//pRX/rXf/23f/vgOPR1TaUf8oQ/Z7/ArxsbG81mswYPWastvyVUvJGt5uSztVX2jtDq2s2R6NmzicnJHwCE5eW3FIDdjYk19l7T6urqzYlvas3m7tsIwG7tGfst0Ora2sTXteZbB0CtdpP9ZggEofYW6KKa+m3zgrg5yzY9JJN/yZHJP0z4ENRxUzJS0iXZQImkWNBiwCkkmo2QHEn7Vkq+QlpGJyUH5y+euSZSJaA5yfW/Znp2ZNGDWiGTD72uaRkzBH84w5B7s1EoSfB28TrntWB93SYSqDT0DCoO3Z5rmm1TIe94pF6i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"/>
  </g>
</svg>`;
    }
    if (logo === "amazon") {
      return html`<svg class="truck-icon" viewBox="0 0 34 34">
  <defs>
    <clipPath id="tb-c"><circle cx="17" cy="17" r="17"/></clipPath>
    <linearGradient id="tb-sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
    <linearGradient id="tb-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="tb-rm"><rect width="34" height="34" fill="url(#tb-fade)"/></mask>
  </defs>
  <g clip-path="url(#tb-c)">
    <rect width="34" height="34" fill="#333b44"/>
    <circle cx="17" cy="17" r="15.4" fill="none" stroke="#fff" stroke-width="0.55" opacity=".9"/>
    <g mask="url(#tb-rm)">
      <rect x="0" y="21.91" width="34" height="0.45" fill="#5a626c"/>
      <g class="lane" fill="#aeb4bb" opacity=".8"><rect x="0" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="6" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="12" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="18" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="24" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="30" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="36" y="24.11" width="2.6" height="0.5" rx=".25"/></g>
    </g>
    <rect class="streak s1" x="2.20" y="14.22" width="3.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s2" x="1.20" y="16.70" width="4.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s3" x="2.60" y="19.18" width="2.80" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <ellipse cx="17.80" cy="22.16" rx="10.08" ry="0.55" fill="#000" opacity=".28"/>
    <image x="5.80" y="10.16" width="24.00" height="12.00" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAADACAMAAAA6NkRVAAABgFBMVEWcn6JaXF/i3drYcyYlKC4kKS02b4vP0NKWZFaQkpQxTmDl5+hfrNDVxrdURjtTVVnXq6NDdpFVIR9OiaRoam1awe6qJSReW1zcjFCkYCs8QD6hoZ2OgnQgHiHHICF9gH16fYE4PUK9wL3IclZ9gYQ8QUO+wcK7vsB+gIQ8PkB8fIC9wcLpgTI1gKCB0PU/sN5APkCCf4GWOkA/RUvUf4PAwL/Av8FMWWUvNkAqKir+/v5HVVsxNTdWY2s6RU8UFRQGBwZteYQxOkRDS1N3g41sdHoAAQOGiYvHyMgcJStKteXS1NSRlZdka3H+/v61t7f+/v7o6OkiJSqlp6gaHSHLHBshIR4wVmsCBAg+seJTqM/7+/sdIScNFBqSmqJju+QdIB2vJytlwu2UAQGao6lastlzSFK7wsc9ruDb4uhSlrZTVllKiKYiHR3o5+iGh4p1d3guNTzp6OnmdBy1trjLIB02Y3oRFBgXHCPGx8i3vcI9rd7MdXSnqapCruFmaWsKgIUEAAAAgHRSTlOiV/r/M0v/lv9h/3X///8v/////57//////////////6Q6//+kRpacVUVVcf////////8h/3mO/wD//P//////////////Df////////+u/9D/Av//////J///lQIM/////////////////0v//6dtbQiP/3L//y8Gdf///27/TsWEHWEAADBjSURBVHja5X2JYxNH0q9wOB0gEJKQBbJ52f32/u7vvTeMpufQtEajQRrLQooxNhiHmCUQ2CQs4XyBf/1V9d2j0WVL8pHGWPJYlqbr13V0VXVV5Xph3G2c+KRSPTDjlDH++Mc//akyxfgXHP9LjE9wHDt+fH290bh7/eCMSuHnxvHnK9UjO1ZXNp89e/7++MtG44AC0PjxCJNfwbC6AiAcED6wALjZOLNa/XWM1ZXX3683DhoAjR8M+ndxPOqWjiOCwV8PAAQmAI1jgv6PUkqI65I4Dl3iEjZcPuSPAyPG//YIzEEpfHliOGz4OHIYiR41HPVa3RipGG01tra22ls7bPR2enp0OvDFxpvOmzcP2Wiy0YLxqDsIwZ9fNg4SAM/4fSVZxqgHdHI9h/3zPGoOk6wBDSYbcRCXDYabwFii6WZZ5rr4H0fm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"/>
  </g>
</svg>`;
    }
    // DHL (default/fallback): original pre-existing raster <image> badge, untouched.
    return html`<svg class="truck-icon" viewBox="0 0 34 34">
  <defs>
    <clipPath id="tb-c"><circle cx="17" cy="17" r="17"/></clipPath>
    <linearGradient id="tb-sg" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/></linearGradient>
    <linearGradient id="tb-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff"/><stop offset=".78" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="tb-rm"><rect width="34" height="34" fill="url(#tb-fade)"/></mask>
  </defs>
  <g clip-path="url(#tb-c)">
    <rect width="34" height="34" fill="#333b44"/>
    <circle cx="17" cy="17" r="15.4" fill="none" stroke="#fff" stroke-width="0.55" opacity=".9"/>
    <g mask="url(#tb-rm)">
      <rect x="0" y="21.91" width="34" height="0.45" fill="#5a626c"/>
      <g class="lane" fill="#aeb4bb" opacity=".8"><rect x="0" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="6" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="12" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="18" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="24" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="30" y="24.11" width="2.6" height="0.5" rx=".25"/><rect x="36" y="24.11" width="2.6" height="0.5" rx=".25"/></g>
    </g>
    <rect class="streak s1" x="2.20" y="14.22" width="3.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s2" x="1.20" y="16.70" width="4.20" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <rect class="streak s3" x="2.60" y="19.18" width="2.80" height="0.56" rx=".28" fill="url(#tb-sg)"/>
    <ellipse cx="17.80" cy="22.16" rx="10.08" ry="0.55" fill="#000" opacity=".28"/>
    <image x="5.80" y="10.41" width="24.00" height="11.75" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAC8CAMAAABG1onvAAABgFBMVEUWHCDrp1BnUBSnIxrKXh+SYhSUkpFgHhTdmC0mHhbm5+dfYmWdn6H551pZX12plFLv4pTUOUbg4eH19vbHKy/l2tikii9QU1fhYUm+wcKfoaS+wL1nam16fYA7PkE2QEeKYFfPr629vsB9gIE5PUIvMjZ9gH5KPkB9gYN8foGdn6E5PUF+goQ9QUTAv8G9vcC+wcG9wb7/4BqCPkC+wcSBfoO/wL/Avr96foG9v8F4fIDAv8CAf4D3xhEyPUT+/v5ERkT+1S/suxHWqREEAgA9QkL2ySrEFyIZGBP92EpPWVixhgZCQzw2NzRSY2P/504pIxQoKSbpuixNYF7GxsaNZwn+0hvxyEokGw2UAwCvBwwAAwe2t7bFmQ7Ppyx0d3f/4zimfAX9/f3+52iYdA6wFA5KNwlzVg3V1tX82WurNwS7kg7+/v63lTAkLDCqiCw9QDzbsyytKCb/9m2oKQOTdymSFwLZdSXdsRfXt0qpqahnaWjNZivq5+evRg7DFR0wLhebAAAAgHRSTlMe////////////llBm//////9rEf/7/zL//6P/pf//Df////8rRf//WlslTqdOdVSeAf//UF+ZiaenOf///wD9////////////////////////////////////Cv///////7H////////////P/wL//////////////////////+hfuMgAAD1ESURBVHja5X2JQ9rY9j8B2doqfjttp52+1+mbN/O27/rbV2qiIRMCEYJsKgIWFdyqDmLd+6//zrlbbkJQtGrb+Z1axchycz/37OeeG3o3ipZDodDjP/zLDz/8r0ePHs3MzMD3R//xg4/+5V/+5x8C6PGPP/74c+h2tPzu7unHH999rRQKnvzl0OMnj96/35m5He28vyk9EvT0v/77Ez/97e9/fzySfv4AJCPop3dfM4UCp//xo1vP/cPTzqOr6D9+ePL9999TXL4NAEIw/d/O7I8DEKH3T588+T709YEwBEAo9Puafp9kfPL4KwMhNDz/M79vev/oydeEQWi8+b9A+v0wAmLwdQKw/FQeaTl2Zpv61WSaZt1xHNu236hIFtDUGVKr1fpzjNEpUAPo9XQZqUfo+fOLLwYsyKLl0NcHQOixkP9lVcxx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"/>
  </g>
</svg>`;
  }

  _renderRow(r, t) {
    const clickable = Boolean(r.url);
    return html`
      <div class="row ${r.source === "manual" ? "manual" : ""}">
        <div
          class="badge"
          style="${r.badge.overlayTruck ? "background:#1c1c1f" : `background:${r.badge.bg};color:${r.badge.fg}`}"
          @click=${clickable ? () => window.open(r.url, "_blank") : undefined}
        >
          ${r.badge.overlayTruck
            ? this._truckBadge(r.badge.logo)
            : html`
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
              `}
        </div>
        <div class="row-body">
          <div class="row-content">
            <div class="row-main">
              <div class="row-top">
                <span class="row-title" @click=${clickable ? () => window.open(r.url, "_blank") : undefined}>${r.title}</span>
                ${r.number
                  ? html`<span class="row-num mono" title="Sendungsverfolgung öffnen" @click=${clickable ? () => window.open(r.url, "_blank") : undefined}>${r.number}</span>`
                  : ""}
              </div>
              ${r.event
                ? html`<div class="row-event ${clickable ? "linky" : ""}" title=${r.eventRaw || ""} @click=${clickable ? () => window.open(r.url, "_blank") : undefined}>${r.event}</div>`
                : ""}
              ${r.retailer
                ? html`<div class="row-retailer"><ha-icon icon="mdi:storefront-outline"></ha-icon><span>${r.retailer}</span></div>`
                : ""}
              ${r.memo
                ? html`<div class="row-memo"><ha-icon icon="mdi:note-text-outline"></ha-icon><span>${r.memo}</span></div>`
                : ""}
            </div>
            <div class="row-side">
              <span class="status ${r.kind}">${r.statusText}</span>
              ${r.eta ? html`<span class="row-eta"><ha-icon icon="mdi:clock-outline"></ha-icon>${t.eta_by(r.eta)}</span>` : ""}
            </div>
          </div>
          ${r.location || r.time || r.history.length
            ? html`<div class="row-meta">
                ${r.location ? html`<ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${r.location}</span>` : ""}
                ${r.time ? html`<span>${r.time}</span>` : ""}
                ${r.history.length
                  ? html`${r.time || r.location ? html`<span> - </span>` : ""}<span
                      class="meta-link"
                      @click=${() => this._toggleTimeline(r.number)}
                      >${t.timeline_details}</span
                    >`
                  : ""}
              </div>`
            : ""}
          ${r.history.length && this._openTimelines.has(r.number) ? this._renderTimeline(r, t) : ""}
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
        ${r.number
          ? html`<button class="row-remove" title="${t.remove_tracking}" @click=${() => this._openConfirm(r)}>
              <ha-icon icon="mdi:trash-can-outline"></ha-icon>
            </button>`
          : ""}
      </div>
    `;
  }

  _toggleTimeline(number) {
    const open = new Set(this._openTimelines);
    if (open.has(number)) open.delete(number);
    else open.add(number);
    this._openTimelines = open;
  }

  _tlDateTime(raw) {
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return { date: String(raw), time: "" };
    const lang = this.hass.locale?.language || "de";
    return {
      date: d.toLocaleDateString(lang, { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }),
      time: d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit" }),
    };
  }

  // Timeline for a single shipment: real 17track events (newest first) plus,
  // unless already delivered, a "current position" node at the top whose
  // connecting line fills in proportionally to elapsed time between the last
  // real event and the 17track ETA -- there's no logged event for a future
  // checkpoint, so this is an interpolation, not another real data point.
  _renderTimeline(r, t) {
    const delivered = r.kind === "delivered";
    const nextStatus = NEXT_MILESTONE_STATUS[r.kind];
    const showFuture = !delivered && Boolean(nextStatus);
    let fill = 0;
    if (showFuture && r.estimatedDelivery && r.history.length) {
      const last = new Date(r.history[0].time).getTime();
      const eta = new Date(r.estimatedDelivery).getTime();
      if (Number.isFinite(last) && Number.isFinite(eta) && eta > last) {
        fill = Math.round(Math.min(1, Math.max(0, (Date.now() - last) / (eta - last))) * 100);
      }
    }
    return html`
      <div class="timeline">
        ${showFuture
          ? html`<div class="tl-item tl-virtual" style="--tl-fill:${fill}%">
              <span class="tl-dot tl-dot-pulse"></span>
              <div class="tl-row">
                <span class="tl-date">${r.eta ? t.eta_by(r.eta) : t.status[nextStatus]}</span>
              </div>
            </div>`
          : ""}
        ${r.history.map((e, i) => {
          const { date, time } = this._tlDateTime(e.time);
          return html`
            <div class="tl-item ${delivered && i === 0 ? "tl-item-final" : ""}">
              <span class="tl-dot"></span>
              <div class="tl-row">
                <span class="tl-date">${date}</span>
                <span class="tl-time">${time}</span>
              </div>
              <div class="tl-desc">${e.description}${e.location ? ` · ${e.location}` : ""}</div>
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderLetters(letters, count, ents, t) {
    const withImages = letters.filter((l) => l && l.image);
    const expandable = withImages.length > 0 || Boolean(ents.dhl_camera);
    // Letters without a date count as "today" so the wording only changes
    // when we positively know a letter arrives later.
    const days = letters.filter(Boolean).map((l) => (l.date ? this._letterDate(l.date) : t.today));
    const title = !days.length || days.every((d) => d === t.today)
      ? t.letters_today(count)
      : days.every((d) => d === t.tomorrow)
        ? t.letters_tomorrow(count)
        : t.letters_announced(count);
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
          <span class="letters-title">${title}</span>
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

  _historyDate(raw) {
    const t = this._t();
    if (!raw) return "";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);
    const today = new Date();
    const diff = Math.round((d.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / 86400000);
    if (diff === 0) return t.today;
    if (diff === -1) return t.yesterday;
    return new Date(raw).toLocaleDateString(this.hass.locale?.language || "de", { weekday: "short", day: "numeric", month: "short" });
  }

  _renderHistoryItem(item, t) {
    const meta = carrierMeta(item.carrier);
    const label = item.number || item.order || "";
    const clickable = Boolean(item.number || item.order);
    const open = clickable ? () => window.open(meta.url(item.number), "_blank") : undefined;
    // Only real 17track-tracked numbers carry an event history -- Amazon
    // orders and pre-history-feature backfilled entries won't, so the
    // Details link only shows up when there's actually something to show.
    const hasHistory = Boolean(item.history && item.history.length);
    const timelineKey = `h-${label}`;
    return html`
      <div class="history-row">
        <div class="history-badge" style="background:${meta.bg};color:${meta.fg}" @click=${open}>
          ${meta.logo && CARRIER_LOGOS[meta.logo]
            ? html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="${CARRIER_LOGOS[meta.logo]}"></path>
              </svg>`
            : meta.short}
        </div>
        <div class="history-info">
          <span class="history-carrier">${meta.label}</span>
          <span class="history-number mono" @click=${open}>${label}</span>
          ${hasHistory
            ? html`<span> - </span><span class="meta-link" @click=${() => this._toggleTimeline(timelineKey)}>${t.timeline_details}</span>`
            : ""}
        </div>
        <span class="history-check"><ha-icon icon="mdi:check-circle-outline"></ha-icon>${t.status.Delivered}</span>
        ${label
          ? html`<button class="row-remove" title="${t.remove_tracking}" @click=${() => this._openConfirm({ number: label, title: meta.label, badge: meta })}>
              <ha-icon icon="mdi:trash-can-outline"></ha-icon>
            </button>`
          : ""}
      </div>
      ${hasHistory && this._openTimelines.has(timelineKey)
        ? this._renderTimeline({ kind: "delivered", history: item.history, eta: "", estimatedDelivery: "" }, t)
        : ""}
    `;
  }

  // How many whole days since a YYYY-MM-DD "delivered" date, using the same
  // local-midnight normalization as _historyDate for consistent day math.
  _daysSinceDelivered(raw) {
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return 0;
    const today = new Date();
    return Math.round((today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) / 86400000);
  }

  // Split point mirrors HISTORY_ARCHIVE_AFTER_DAYS in the integration's
  // const.py -- purely a display grouping, the backend keeps everything for
  // HISTORY_RETENTION_DAYS (90) regardless of this cutoff.
  _renderHistorySections(history, t) {
    const recent = [];
    const archived = [];
    for (const item of history) {
      if (!item) continue;
      (this._daysSinceDelivered(item.delivered) < 21 ? recent : archived).push(item);
    }
    return html`
      ${recent.length
        ? this._renderHistoryBlock(recent, t.recently_delivered, "mdi:package-variant-closed-check", this._recentOpen, () => {
            this._recentOpen = !this._recentOpen;
          }, t)
        : ""}
      ${archived.length
        ? this._renderHistoryBlock(archived, t.history, "mdi:archive-outline", this._historyOpen, () => {
            this._historyOpen = !this._historyOpen;
          }, t)
        : ""}
    `;
  }

  _renderHistoryBlock(items, title, icon, isOpen, toggle, t) {
    const groups = [];
    let current = null;
    for (const item of items) {
      if (!current || current.date !== item.delivered) {
        current = { date: item.delivered, items: [] };
        groups.push(current);
      }
      current.items.push(item);
    }
    return html`
      <div class="history">
        <div class="history-head" @click=${toggle}>
          <ha-icon icon="${icon}"></ha-icon>
          <span class="history-title">${title}</span>
          <ha-icon class="chev" icon="${isOpen ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon>
        </div>
        ${isOpen
          ? html`<div class="history-body">
              ${groups.map(
                (g) => html`
                  <div class="history-group">
                    <div class="history-date">${this._historyDate(g.date)}</div>
                    ${g.items.map((item) => this._renderHistoryItem(item, t))}
                  </div>
                `
              )}
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
        position: relative;
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
      .header-left svg.logo {
        width: 24px;
        height: 24px;
        color: var(--primary-color);
        flex-shrink: 0;
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
      .iconbtn.addbtn {
        color: var(--primary-color);
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
      .chip.out {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
        color: var(--warning-color, #b26a00);
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
      .badge svg.truck-icon {
        width: 100%;
        height: 100%;
      }
      .lane{animation:lane 1.2s linear infinite}
      .streak{opacity:0;animation:streak 1.2s ease-in-out infinite}
      .streak.s2{animation-delay:-.4s}.streak.s3{animation-delay:-.8s}
      @keyframes lane{to{transform:translateX(-6px)}}
      @keyframes streak{0%{opacity:0;transform:translateX(1.2px)}35%{opacity:1}100%{opacity:0;transform:translateX(-2.6px)}}
      @media (prefers-reduced-motion:reduce){.lane,.streak,.streak{opacity:.6}}
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
        overflow: hidden;
      }
      .row-body {
        flex: 1;
        min-width: 0;
      }
      .row-top {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .row-content {
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }
      .row-main {
        flex: 1;
        min-width: 0;
      }
      .row-side {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
        flex-shrink: 0;
      }
      .row-eta {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.68em;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }
      .row-title {
        cursor: pointer;
      }
      .row-title {
        font-size: 0.88em;
        font-weight: 500;
        color: var(--primary-text-color);
        flex-shrink: 0;
      }
      .row-num {
        flex: 1;
        min-width: 0;
        margin-left: 8px;
        font-size: 0.72em;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .row-num:hover {
        text-decoration: underline;
        color: var(--primary-color);
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
      .row-event.linky {
        cursor: pointer;
      }
      .row-event.linky:hover {
        text-decoration: underline;
        color: var(--primary-color);
      }
      .row-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 3px 6px;
        font-size: 0.7em;
        color: var(--secondary-text-color);
        opacity: 0.8;
        margin-top: 2px;
      }
      .row-meta ha-icon {
        --mdc-icon-size: 12px;
      }
      .row-eta ha-icon {
        --mdc-icon-size: 12px;
      }
      .mono {
        font-family: var(--code-font-family, monospace);
      }

      .meta-link {
        cursor: pointer;
        color: var(--secondary-text-color);
        text-decoration: underline dotted;
        text-underline-offset: 2px;
      }
      .meta-link:hover {
        color: var(--primary-color);
        text-decoration-color: currentColor;
      }

      .timeline {
        margin-top: 10px;
        padding-left: 4px;
      }
      .tl-item {
        position: relative;
        padding-left: 20px;
        padding-bottom: 14px;
      }
      .tl-item:last-child {
        padding-bottom: 0;
      }
      .tl-item:not(:last-child)::after {
        content: "";
        position: absolute;
        left: 3px;
        top: 14px;
        bottom: -2px;
        width: 2px;
        background: var(--divider-color);
      }
      .tl-dot {
        position: absolute;
        left: 0;
        top: 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--divider-color);
      }
      .tl-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
        font-size: 0.76em;
      }
      .tl-date {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .tl-time {
        color: var(--secondary-text-color);
        font-variant-numeric: tabular-nums;
      }
      .tl-desc {
        font-size: 0.74em;
        color: var(--secondary-text-color);
        margin-top: 1px;
      }
      .tl-item-final .tl-dot {
        background: var(--success-color, #4caf50);
      }
      .tl-virtual .tl-dot {
        background: var(--card-background-color, #fff);
        border: 2px solid var(--info-color, #039be5);
        top: 3px;
        left: -1px;
      }
      .tl-virtual .tl-date {
        color: var(--info-color, #0277bd);
      }
      .tl-virtual::after {
        background: linear-gradient(
          to bottom,
          var(--info-color, #039be5) var(--tl-fill, 0%),
          var(--divider-color) var(--tl-fill, 0%)
        );
      }
      @media (prefers-reduced-motion: no-preference) {
        .tl-dot-pulse {
          animation: tl-pulse 1.8s ease-in-out infinite;
        }
      }
      @keyframes tl-pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 color-mix(in srgb, var(--info-color, #039be5) 45%, transparent);
        }
        50% {
          box-shadow: 0 0 0 5px color-mix(in srgb, var(--info-color, #039be5) 0%, transparent);
        }
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
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 8px;
        padding: 0 16px 12px;
      }
      .letter {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .letter img {
        width: 100%;
        height: 68px;
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
        grid-column: 1 / -1;
        align-items: center;
        justify-content: center;
        height: 76px;
        border: 1px dashed var(--divider-color);
        border-radius: 6px;
        cursor: pointer;
      }

      .history {
        border-top: 1px solid var(--divider-color);
        background: var(--secondary-background-color);
      }
      .history-head {
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 10px 16px;
        cursor: pointer;
      }
      .history-head ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }
      .history-title {
        flex: 1;
        font-size: 0.85em;
        color: var(--primary-text-color);
      }
      .history-body {
        padding: 0 16px 12px;
      }
      .history-group + .history-group {
        margin-top: 10px;
      }
      .history-date {
        font-size: 0.68em;
        color: var(--secondary-text-color);
        text-transform: capitalize;
        margin-bottom: 4px;
      }
      .history-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 5px 0;
      }
      .history-badge {
        position: relative;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.6em;
        font-weight: 700;
        flex-shrink: 0;
        cursor: pointer;
        user-select: none;
      }
      .history-badge svg {
        width: 15px;
        height: 15px;
        display: block;
      }
      .history-info {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .history-carrier {
        font-size: 0.78em;
        color: var(--primary-text-color);
        flex-shrink: 0;
      }
      .history-number {
        font-size: 0.72em;
        color: var(--secondary-text-color);
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .history-check {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 0.68em;
        color: var(--success-color, #4caf50);
        flex-shrink: 0;
      }
      .history-check ha-icon {
        --mdc-icon-size: 14px;
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

      .row-remove {
        background: none;
        border: none;
        color: var(--secondary-text-color);
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        align-self: flex-start;
        opacity: 0.55;
      }
      .row-remove ha-icon {
        --mdc-icon-size: 15px;
      }
      .row-remove:hover {
        opacity: 1;
        background: color-mix(in srgb, var(--error-color, #f44336) 18%, transparent);
        color: var(--error-color, #f44336);
      }
      .row.manual .row-title::after {
        content: "manuell";
        margin-left: 7px;
        font-size: 0.68em;
        font-weight: 400;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
        padding: 1px 7px;
        border-radius: 10px;
        vertical-align: middle;
      }
      .row-retailer,
      .row-memo {
        font-size: 0.78em;
        color: var(--secondary-text-color);
        margin-top: 2px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .row-memo {
        font-style: italic;
      }
      .row-retailer ha-icon,
      .row-memo ha-icon {
        --mdc-icon-size: 12px;
        flex-shrink: 0;
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        z-index: 999;
      }
      .sheet {
        background: var(--secondary-background-color);
        border-radius: 12px;
        width: 100%;
        max-width: 320px;
        max-height: calc(100vh - 32px);
        overflow-y: auto;
        padding: 16px 16px 14px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        box-sizing: border-box;
      }
      .sheet h3 {
        margin: 0 0 3px;
        font-size: 0.98em;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--primary-text-color);
      }
      .sheet h3 .warn-icon {
        --mdc-icon-size: 20px;
        color: var(--error-color, #f44336);
        flex-shrink: 0;
      }
      .sheet .hint {
        margin: 0 0 14px;
        font-size: 0.78em;
        color: var(--secondary-text-color);
        line-height: 1.45;
      }
      .sheet .field {
        margin-bottom: 10px;
      }
      .sheet .field label {
        display: block;
        font-size: 0.74em;
        color: var(--secondary-text-color);
        margin-bottom: 5px;
      }
      .sheet .field input {
        width: 100%;
        background: var(--card-background-color, var(--card-background));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 9px 10px;
        color: var(--primary-text-color);
        font-family: var(--code-font-family, monospace);
        font-size: 0.86em;
        box-sizing: border-box;
      }
      .sheet .field input:focus {
        outline: none;
        border-color: var(--primary-color);
      }
      .detect-row {
        display: flex;
        align-items: center;
        gap: 7px;
        margin: -2px 0 10px;
        font-size: 0.78em;
        min-height: 22px;
      }
      .detect-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 2px 9px 2px 6px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.92em;
      }
      .detect-badge ha-icon {
        --mdc-icon-size: 13px;
      }
      .confirm-target {
        display: flex;
        align-items: center;
        gap: 9px;
        background: var(--card-background-color, var(--card-background));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 10px;
        margin: 12px 0 14px;
      }
      .confirm-target .badge {
        width: 26px;
        height: 26px;
        font-size: 0.6em;
        flex-shrink: 0;
      }
      .confirm-target .badge svg {
        width: 15px;
        height: 15px;
      }
      .confirm-target .ct-title {
        font-size: 0.86em;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .confirm-target .ct-num {
        font-size: 0.72em;
        color: var(--secondary-text-color);
      }
      .sheet-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 4px;
      }
      .btn {
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        font-size: 0.84em;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
      }
      .btn.ghost {
        background: transparent;
        color: var(--secondary-text-color);
      }
      .btn.ghost:hover {
        background: rgba(255, 255, 255, 0.06);
      }
      .btn.primary {
        background: var(--primary-color);
        color: #04263a;
      }
      .btn.primary:hover {
        filter: brightness(1.08);
      }
      .btn.primary:disabled {
        opacity: 0.5;
        cursor: default;
        filter: none;
      }
      .btn.danger {
        background: var(--error-color, #f44336);
        color: #fff;
      }
      .btn.danger:hover {
        filter: brightness(1.08);
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
        ${this._toggle(de ? "Historie anzeigen" : "Show history", "show_history")}
        <div class="switch-row">
          <ha-switch
            .checked=${this._config.history_expanded === true}
            @change=${(e) => this._set("history_expanded", e.target.checked ? true : undefined)}
          ></ha-switch>
          <span>${de ? "Historie standardmäßig aufgeklappt" : "History expanded by default"}</span>
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
