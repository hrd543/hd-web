import './ToastProvider.css'
import { WebComponent } from '../shared/index.js'
import { generateId } from './generateId.js'
import { Toast } from './Toast.js'
import { AddToastEventDetail, ToastEvent } from './toastEvents.js'
import { ToastInfo } from './types.js'

export class ToastProvider extends WebComponent {
  static override _key = 'hd-toast-provider'
  toasts: Record<string, ToastInfo> | undefined

  constructor() {
    super()

    this.initListener(
      () => document,
      ToastEvent.key,
      this.handleEvent.bind(this) as EventListener
    )
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

  override disconnect() {
    for (const toastId in this.toasts) {
      clearTimeout(this.toasts?.[toastId]?.timeoutId)
    }
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [ToastEvent.key]: ToastEvent
  }
}
