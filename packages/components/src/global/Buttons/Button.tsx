import { View, Enhance } from 'hd-web'

import ButtonBehaviour from './Button.client.js'
import { ButtonProps } from './types.js'

export const Button: View<ButtonProps> = ({
  type,
  disabled = false,
  title
}) => {
  return (
    <Enhance.button
      with={ButtonBehaviour}
      disabled={disabled}
      class={`Button Button--${type}`}
    >
      {title}
    </Enhance.button>
  )
}
