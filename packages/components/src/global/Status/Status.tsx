import './Status.css'

import { type JSX } from '@hd-web/jsx'

export type StatusProps = {
  type: 'success' | 'error'
  message: string
}

export const Status: JSX.FuncComponent<StatusProps> = ({ type, message }) => {
  return (
    <div class={`hd-status hd-status--${type}`}>
      <p>{message}</p>
    </div>
  )
}
