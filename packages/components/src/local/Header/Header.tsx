import './Header.css'
import { JSX } from '@hd-web/jsx'
import type { HeaderProps } from './types.js'
import { HdHeader } from './HdHeader.js'
import { MenuButton } from './MenuButton.js'

export const Header: JSX.FuncComponent<HeaderProps> = ({
  items,
  logo,
  className = '',
  height = '64px',
  bgColour,
  fontColour
}) => (
  <nav
    class={`hd-header ${className}`}
    style={{
      '--_height': height,
      '--_bg-colour': bgColour,
      '--_font-colour': fontColour
    }}
  >
    <HdHeader>
      <div class="hd-header_logo">{logo}</div>
      <ul class="hd-header_links">
        {items.map(({ link, title }) => (
          <li class="hd-header_item">
            <a href={link}>{title}</a>
          </li>
        ))}
      </ul>
      <MenuButton height={30} className="hd-header_menuButton" />
    </HdHeader>
  </nav>
)
