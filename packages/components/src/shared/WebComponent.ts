export class WebComponent extends HTMLElement {
  protected static _key: string

  static get key() {
    if (!customElements.get(this._key)) {
      customElements.define(this._key, this)
    }

    return this._key
  }

  constructor() {
    super()
  }
}
