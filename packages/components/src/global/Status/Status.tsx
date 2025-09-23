import './Status.css'

import { View } from 'hd-web'

export type StatusProps = {
  type: 'success' | 'error'
  message: string
}

export const Status: View<StatusProps> = ({ type, message }) => {
  return (
    <div class={`hd-status hd-status--${type}`}>
      <p>{message}</p>
    </div>
  )
}
