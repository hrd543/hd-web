import { ToastId, ToastParams } from './types.js'

export type AddToastEventDetail = ToastParams & {
  eventType: 'add'
  duration: number
}

export type RemoveToastEventDetail = ToastId & {
  eventType: 'remove'
}

export class ToastEvent extends CustomEvent<
  AddToastEventDetail | RemoveToastEventDetail
> {
  static get key() {
    return 'ToastEvent' as const
  }

  constructor(detail: AddToastEventDetail | RemoveToastEventDetail) {
    super(ToastEvent.key, { detail })
  }
}
