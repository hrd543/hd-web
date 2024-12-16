import './Header.css'
import { JSX } from '@hd-web/jsx'
import type { HeaderProps } from './types.js'
import { header } from './headerInteract.js'
import { MenuButton } from './MenuButton.js'
import { interact } from '@hd-web/build'

export const Header: JSX.FuncComponent<HeaderProps> = ({
  items,
  logo,
  className = '',
  height = '64px',
  bgColour,
  fontColour
}) => {
  const id = interact(header)

  return (
    <nav
      class={`hd-header ${className ?? ''}`}
      style={{
        '--_height': height,
        '--_bg-colour': bgColour,
        '--_font-colour': fontColour
      }}
    >
      <div data-hd-id={id} class="hd-header_container">
        <div class="hd-header_logo">{logo}</div>
        <ul class="hd-header_links">
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
