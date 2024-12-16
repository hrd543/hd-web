import './Toast.css'
import { ToastEvent } from './toastEvents.js'
import { ToastId, ToastParams } from './types.js'
import { WebComponent } from './WebComponent.js'

type ToastDescription = ToastParams & ToastId

/**
 * @deprecated
 */
export class Toast extends WebComponent {
  static override _key = 'hd-toast'

  /** Display a new toast message */
  static show(message: string, type: ToastParams['type'], duration = 5000) {
    document.dispatchEvent(
      new ToastEvent({ eventType: 'add', message, type, duration })
    )
  }

  constructor() {
    super()
    this.initListener(() => this, 'click', this.handleClick.bind(this))
  }

  private _info: ToastDescription | undefined

  private handleClick() {
    document.dispatchEvent(
      new ToastEvent({ eventType: 'remove', id: this._info!.id })
    )
  }

  init(info: ToastDescription) {
    if (this._info) {
      throw new Error('Tried to reinitialise a toast')
    }

    this._info = info
  }

  override connect() {
    if (!this._info) {
      throw new Error('Tried to add a toast without initialising it')
    }

    this.role = 'status'
    this.innerText = this._info.message
    this.className = `Toast Toast--${this._info.type}`
  }
}
