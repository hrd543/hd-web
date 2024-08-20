import { WebComponent } from '../shared/index.js'
import { ToastEvent } from './toastEvents.js'
import { ToastInfo } from './types.js'

export class Toast extends WebComponent {
  protected static _key = 'toast-item' as const

  constructor() {
    super()
  }

  private _info: ToastInfo | undefined

  private handleClick() {
    document.dispatchEvent(
      new ToastEvent({ type: 'remove', id: this._info!.id })
    )
  }

  init(info: ToastInfo) {
    if (this._info) {
      throw new Error('Tried to reinitialise a toast')
    }

    this._info = info
  }

  connectedCallback() {
    if (!this._info) {
      throw new Error('Tried to add a toast without initialising it')
    }

    this.addEventListener('click', this.handleClick.bind(this))
  }

  disconnectedCallback() {
    this._info = undefined
    this.removeEventListener('click', this.handleClick.bind(this))
  }
}

declare module '@hd-web/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'toast-item': {}
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'toast-item': Toast
  }
}
