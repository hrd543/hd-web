import { WebComponent } from '../shared/index.js'
import { generateId } from './generateId.js'
import { Toast } from './Toast.js'
import { AddToastEventDetail, ToastEvent } from './toastEvents.js'
import { ToastInfo } from './types.js'

export class ToastProvider extends WebComponent {
  protected static _key = 'toast-provider' as const
  toasts: Record<string, ToastInfo> | undefined

  constructor() {
    super()
  }

  private handleEvent(e: ToastEvent) {
    if (e.detail.eventType === 'add') {
      this.handleAdd(e.detail)
    } else {
      this.handleRemove(e.detail.id)
    }
  }

  private handleRemove(id: string) {
    const toast = this.toasts?.[id]
    if (!toast) {
      return
    }

    clearTimeout(toast.timeoutId)
    this.removeChild(toast.element)
    delete this.toasts![id]
  }

  private handleAdd(params: AddToastEventDetail) {
    if (!this.toasts) {
      this.toasts = {}
    }

    const element = Toast.create()
    const toastId = generateId()
    const timeoutId = setTimeout(() => {
      this.handleRemove(toastId)
    }, params.duration)

    element.init({
      id: toastId,
      message: params.message,
      type: params.type
    })

    this.toasts[toastId] = {
      id: toastId,
      timeoutId,
      element
    }

    this.append(element)
  }

  connectedCallback() {
    document.addEventListener(
      ToastEvent.key,
      this.handleEvent.bind(this) as EventListener
    )
  }

  disconnectedCallback() {
    for (const toastId in this.toasts) {
      const toast = this.toasts?.[toastId]
      clearTimeout(toast?.timeoutId)
    }

    document.removeEventListener(
      ToastEvent.key,
      this.handleEvent.bind(this) as EventListener
    )
  }
}

declare module '@hd-web/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'toast-provider': {}
    }
  }
}
