// main.js
var a2 = class extends HTMLElement {
  static get key() {
    return customElements.get(this._key) || customElements.define(this._key, this), this._key;
  }
  constructor() {
    super();
  }
};
var n = class extends a2 {
  static {
    this._key = "interactive-header";
  }
  constructor() {
    super(), this.menu = null;
  }
  onClick(i2) {
    if (!this.menu || !i2.target) return;
    let t = i2.target;
    (t.tagName === "A" || t.tagName === "LI") && this.menu.classList.remove("Header_links-show"), t.classList.contains("Header_menuButton") && (this.menu.classList.contains("Header_links-show") ? this.menu.classList.remove("Header_links-show") : this.menu.classList.add("Header_links-show"));
  }
  connectedCallback() {
    this.menu = this.querySelector(".Header_links"), this.addEventListener("click", this.onClick.bind(this));
  }
  disconnectedCallback() {
    this.menu = null, this.removeEventListener("click", this.onClick.bind(this));
  }
};
customElements.define("interactive-header", n);
