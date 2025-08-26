import { FuncComponent, registerClient } from 'hd-web'
import { ButtonProps } from './types.js'
import ButtonClient from './Button.client.js'

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
