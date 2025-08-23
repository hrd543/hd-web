import { ButtonType } from './types.js'
import { FuncComponent } from 'hd-web'
import './Button.css'
import './LinkButton.css'

export type LinkButtonProps = {
  link: string
  title: string
  type: ButtonType
}

export const LinkButton: FuncComponent<LinkButtonProps> = ({
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
