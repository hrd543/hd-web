'use strict'
;(() => {
  var t = class extends HTMLElement {
      static get key() {
        return (
          customElements.get(this._key) ||
            customElements.define(this._key, this),
          this._key
        )
      }
      constructor() {
        super()
      }
    },
    n = class extends t {
      static {
        this._key = 'hd-header'
      }
      constructor() {
        super(), (this.menu = null)
      }
      onClick(s) {
        if (!this.menu || !s.target) return
        let e = s.target
        ;(e.tagName === 'A' || e.tagName === 'LI') &&
          this.menu.classList.remove('Header_links-show'),
          e.classList.contains('Header_menuButton') &&
            (this.menu.classList.contains('Header_links-show')
              ? this.menu.classList.remove('Header_links-show')
              : this.menu.classList.add('Header_links-show'))
      }
      connectedCallback() {
        ;(this.menu = this.querySelector('.Header_links')),
          this.addEventListener('click', this.onClick.bind(this))
      }
      disconnectedCallback() {
        ;(this.menu = null),
          this.removeEventListener('click', this.onClick.bind(this))
      }
    }
  customElements.define('hd-header', n)
})()
