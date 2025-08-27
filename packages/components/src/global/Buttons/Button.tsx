import { FuncComponent, registerClient } from 'hd-web'

import ButtonClient from './Button.client.js'
import { ButtonProps } from './types.js'

export const Button: FuncComponent<ButtonProps> = ({
  type,
  disabled = false,
  title
}) => {
  return (
    <button $click="click" disabled={disabled} class={`Button Button--${type}`}>
      {title}
    </button>
  )
}

registerClient(Button, ButtonClient)
