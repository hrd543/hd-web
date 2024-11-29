import { JSX } from '@hd-web/jsx'
import { ButtonType } from './types.js'
import './Button.css'
import './LinkButton.css'

export type LinkButtonProps = {
  _key: string
  title: string
  type: ButtonType
}

export const LinkButton: JSX.FuncComponent<LinkButtonProps> = ({
  _key,
  title,
  type
}) => {
  return (
    <a href={`#${_key}`} class={`Button LinkButton Button--${type}`}>
      {title}
    </a>
  )
}
