import { JSX } from '@hd-web/jsx'
import { ButtonType } from './types.js'
import './Button.css'
import './LinkButton.css'

export type LinkButtonProps = {
  link: string
  title: string
  type: ButtonType
}

export const LinkButton: JSX.FuncComponent<LinkButtonProps> = ({
  link,
  title,
  type
}) => {
  return (
    <a href={link} class={`Button LinkButton Button--${type}`}>
      {title}
    </a>
  )
}
