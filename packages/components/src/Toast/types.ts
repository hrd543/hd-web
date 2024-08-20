export type ToastParams = {
  message: string
  type: 'failure' | 'success' | 'default'
  duration: number
}

export type ToastInfo = {
  timeoutId: NodeJS.Timeout
  id: string
  element: HTMLElement
}
