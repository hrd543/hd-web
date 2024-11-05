type Listener<
  T extends EventTarget = EventTarget,
  K extends
    keyof GlobalEventHandlersEventMap = keyof GlobalEventHandlersEventMap
> = {
  element: () => T | null
  event: K
  listener: (e: GlobalEventHandlersEventMap[K]) => void
}

/**
 * The base component class which contains methods for defining
 * the custom element using its key
 */
abstract class HdComponent extends HTMLElement {
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
      // @ts-expect-error We always implement this abstract class so not an issue
      customElements.define(this._key, this)
    }

    return this._key
  }

  /** Create a new element with correct typing */
  static create<T extends typeof HdComponent>(this: T) {
    return document.createElement(this.key) as InstanceType<T>
  }
}

/**
 * A wrapper around HTMLElement which makes it easier to work with
 * web components.
 */
export class WebComponent extends HdComponent {
  protected _listeners: Listener[]
  /** Has the connectedCallback run yet? */
  protected hasConnected: boolean

  constructor() {
    super()

    this._listeners = []
    this.hasConnected = false
  }

  /**
   * Add the listener for the given event to the element once
   * the component connects, and remove it upon disconnection.
   *
   * This should only be run in the constructor
   */
  initListener<
    T extends EventTarget,
    K extends keyof GlobalEventHandlersEventMap
  >(
    element: Listener<T, K>['element'],
    event: K,
    listener: Listener<T, K>['listener']
  ) {
    if (this.hasConnected) {
      throw new Error("Don't initialise a listener after connecting")
    }

    this._listeners.push({ element, event, listener } as unknown as Listener)
  }

  /** Will be run inside connectedCallback */
  connect() {}

  /** Will be run inside disconnectedCallback */
  disconnect() {}

  /** Don't run this directly, prefer the connect callback */
  connectedCallback() {
    this.hasConnected = true

    // Register any listeners
    this._listeners?.forEach(({ element, event, listener }) => {
      element()?.addEventListener(event, listener)
    })

    this.connect()
  }

  /** Don't run this directly, prefer the disconnect callback */
  disconnectedCallback() {
    // De-register any listeners
    this._listeners?.forEach(({ element, event, listener }) => {
      element()?.removeEventListener(event, listener)
    })

    this.disconnect()
  }
}
