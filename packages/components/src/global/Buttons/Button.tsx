import { View, Interactive } from 'hd-web'

import ButtonBehaviour from './Button.client.js'
import { ButtonProps } from './types.js'

export const Button: View<ButtonProps> = ({
  type,
  disabled = false,
  title
}) => {
  return (
    <Interactive
      _as="button"
      _use={ButtonBehaviour}
      disabled={disabled}
      class={`Button Button--${type}`}
    >
      {title}
    </Interactive>
  )
}
