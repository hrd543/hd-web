import './Button.css'
import './LinkButton.css'

import { View } from 'hd-web'

import { ButtonType } from './types.js'

export type LinkButtonProps = {
  link: string
  title: string
  type: ButtonType
}

export const LinkButton: View<LinkButtonProps> = ({ link, title, type }) => {
  return (
    <a href={link} class={`Button LinkButton Button--${type}`}>
      {title}
    </a>
  )
}
