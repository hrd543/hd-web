import './Header.css'
import { MenuButton } from './MenuButton.js'
import { FuncComponent, registerClient } from 'hd-web'
import { HeaderProps } from './types.js'
import HeaderClient from './Header.client.js'

export const Header: FuncComponent<HeaderProps> = ({
  items,
  logo,
  className = '',
  height = '64px',
  bgColour,
  fontColour
}) => {
  return (
    <nav
      class={`hd-header ${className ?? ''}`}
      style={{
        '--_height': height,
        '--_bg-colour': bgColour,
        '--_font-colour': fontColour
      }}
    >
      <div $click="handleClick" class="hd-header_container">
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
    </nav>
  )
}

registerClient(Header, HeaderClient)
