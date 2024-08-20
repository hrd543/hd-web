export class WebComponent extends HTMLElement {
  protected static _key: string

  static get key() {
    if (!customElements.get(this._key)) {
      customElements.define(this._key, this)
    }

    return this._key
  }

  /** Create a new element with correct typing */
  static create<T extends typeof WebComponent>(this: T) {
    return document.createElement(this.key) as InstanceType<T>
  }

  constructor() {
    super()
  }
}
