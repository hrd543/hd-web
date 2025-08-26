import './Status.css'

import { FuncComponent } from 'hd-web'

export type StatusProps = {
  type: 'success' | 'error'
  message: string
}

export const Status: FuncComponent<StatusProps> = ({ type, message }) => {
  return (
    <div class={`hd-status hd-status--${type}`}>
      <p>{message}</p>
    </div>
  )
}
