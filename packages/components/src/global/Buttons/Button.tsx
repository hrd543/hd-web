import { JSX } from '@hd-web/jsx'
import { ButtonType } from './types.js'
import { interact } from '@hd-web/build'
import { buttonInteract } from './buttonInteract.js'

export type ButtonProps = {
  type: ButtonType
  disabled?: boolean
  title: string
}

export const Button: JSX.FuncComponent<ButtonProps> = ({
  type,
  disabled = false,
  title
}) => {
  const id = interact(buttonInteract)

  return (
    <button
      data-hd-id={id}
      disabled={disabled}
      class={`Button Button--${type}`}
    >
      {title}
    </button>
  )
}
