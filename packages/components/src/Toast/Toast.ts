import './Toast.css'
import { WebComponent } from '../shared/index.js'
import { ToastEvent } from './toastEvents.js'
import { ToastId, ToastParams } from './types.js'

type ToastDescription = ToastParams & ToastId

export class Toast extends WebComponent {
  protected static get _key() {
    return 'hd-toast' as const
  }

  constructor() {
    super()
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

  connectedCallback() {
    if (!this._info) {
      throw new Error('Tried to add a toast without initialising it')
    }

    this.role = 'status'
    this.innerText = this._info.message
    this.className = `Toast Toast--${this._info.type}`
    this.addEventListener('click', this.handleClick.bind(this))
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick.bind(this))
  }
}

// Not declaring hd-toast as an element in the jsx since this component
// shouldn't be used on its own.
