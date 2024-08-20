import { ToastParams } from './types.js'

type Add = {
  type: 'add'
  params: ToastParams
}

type Remove = {
  type: 'remove'
  id: string
}

export class ToastEvent extends CustomEvent<Add | Remove> {
  static key = 'ToastEvent' as const

  constructor(event: Add | Remove) {
    super(ToastEvent.key, { detail: event })
  }
}
