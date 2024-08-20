import { WebComponent } from '../shared/index.js'
import { generateId } from './generateId.js'
import { ToastEvent } from './toastEvents.js'
import { ToastInfo, ToastParams } from './types.js'

export class ToastProvider extends WebComponent {
  protected static _key = 'toast-provider' as const
  toasts: Record<string, ToastInfo> | undefined

  constructor() {
    super()
  }

  private handleEvent(e: ToastEvent) {
    if (e.detail.type === 'add') {
      this.handleAdd(e.detail.params)
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

  private handleAdd(params: ToastParams) {
    if (!this.toasts) {
      return
    }

    const element = document.createElement('toast-item')
    const toastId = generateId()
    const timeoutId = setTimeout(() => {
      this.handleRemove(toastId)
    }, params.duration)

    element.init({
      id: toastId,
      timeoutId,
      element
    })

    this.append(element)
  }

  connectedCallback() {
    this.toasts = {}
    this.addEventListener(
      ToastEvent.key,
      this.handleEvent.bind(this) as EventListener
    )
  }

  disconnectedCallback() {
    for (const toastId in this.toasts) {
      const toast = this.toasts?.[toastId]
      clearTimeout(toast?.timeoutId)
    }

    this.removeEventListener(
      ToastEvent.key,
      this.handleEvent.bind(this) as EventListener
    )

    this.toasts = undefined
  }
}

declare module '@hd-web/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'toast-provider': {}
    }
  }
}
