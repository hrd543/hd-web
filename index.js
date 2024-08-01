class TestComponent extends HTMLElement {
  menu;

  constructor() {
    super();
    this.menu = null;
  }

  onClick(e) {
    if (!this.menu) {
      return;
    }

    // Need to check what we clicked on. If it was a link,
    // then hide the menu
    if (e.target.tagName === "A" || e.target.tagName === "LI") {
      this.menu.classList.remove("Header_links-show");
    }

    // If the menu button, then show/hide
    if (e.target.classList.contains("Header_menuButton")) {
      if (this.menu.classList.contains("Header_links-show")) {
        this.menu.classList.remove("Header_links-show");
      } else {
        this.menu.classList.add("Header_links-show");
      }
    }
  }

  connectedCallback() {
    this.menu = this.querySelector(".Header_links");

    this.addEventListener("click", this.onClick.bind(this));
  }
}

customElements.define("test-component", TestComponent);
