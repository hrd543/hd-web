import './Header.css'

import { Interactive, View } from 'hd-web'

import HeaderBehaviour from './Header.client.js'
import { MenuButton } from './MenuButton.js'
import { HeaderProps } from './types.js'

export const Header: View<HeaderProps> = ({
  items,
  logo,
  className = '',
  height = '64px',
  bgColour,
  fontColour
}) => {
  return (
    <Interactive
      _as="nav"
      _use={HeaderBehaviour}
      class={`hd-header ${className ?? ''}`}
      style={{
        '--_height': height,
        '--_bg-colour': bgColour,
        '--_font-colour': fontColour
      }}
    >
      <div class="hd-header_container">
        <a href="/" class="hd-header_logo">
          {logo}
        </a>
        <ul ref="links" class="hd-header_links">
          {items.map(({ link, title }) => (
            <li class="hd-header_item">
              <a href={link}>{title}</a>
            </li>
          ))}
        </ul>
        <MenuButton height={30} className="hd-header_menuButton" />
      </div>
    </Interactive>
  )
}
