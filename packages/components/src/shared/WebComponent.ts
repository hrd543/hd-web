export class WebComponent extends HTMLElement {
  protected static _key: string

  static get key() {
    // When we transform to es6, static fields like class A {static _key = 3}
    // will turn into separate statements like A._key = 3
    // This means A can't be removed if unused, so instead use a getter
    // so that it is preserved, and A can be removed.
    if (!Object.getOwnPropertyDescriptor(this, '_key')?.get) {
      throw new Error(
        '_key must be a getter so that it may be removed if unused.'
      )
    }

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
