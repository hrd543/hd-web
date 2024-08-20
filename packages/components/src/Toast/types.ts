type ToastType = 'failure' | 'success' | 'default'

export type ToastParams = {
  type: ToastType
  message: string
}

export type ToastId = {
  id: string
}

export type ToastInfo = ToastId & {
  timeoutId: NodeJS.Timeout
  element: HTMLElement
}
