import { LitElement, css, html } from "lit";

if (!customElements.get("hui-view")) {
  class HaLitElement extends LitElement {}
  HaLitElement.prototype.html = html;
  HaLitElement.prototype.css = css;

  class HuiView extends HaLitElement {}
  customElements.define("hui-view", HuiView);
}

if (!customElements.get("mail-and-packages-card")) {
  await import("../../dist/Home-Assistant-Mail-And-Packages-Custom-Card.js");
}
