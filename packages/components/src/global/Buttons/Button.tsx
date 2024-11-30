import { JSX } from '@hd-web/jsx'
import { ButtonType } from './types.js'
import { HdButton } from './HdButton.js'

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
  return (
    <HdButton>
      <button disabled={disabled} class={`Button Button--${type}`}>
        {title}
      </button>
    </HdButton>
  )
}
