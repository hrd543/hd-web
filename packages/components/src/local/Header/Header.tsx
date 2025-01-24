import './Header.css'
import { JSX } from '@hd-web/jsx'
import type { HeaderProps } from './types.js'
import { useHeader } from './useHeader.js'
import { MenuButton } from './MenuButton.js'
import { interact } from '@hd-web/build'
import { attachIdToElement } from '../../shared/getContainerElement.js'

export const Header: JSX.FuncComponent<HeaderProps> = ({
  items,
  logo,
  className = '',
  height = '64px',
  bgColour,
  fontColour
}) => {
  const id = interact(useHeader)

  return (
    <nav
      class={`hd-header ${className ?? ''}`}
      style={{
        '--_height': height,
        '--_bg-colour': bgColour,
        '--_font-colour': fontColour
      }}
    >
      <div {...attachIdToElement(id)} class="hd-header_container">
        <a href="/" class="hd-header_logo">
          {logo}
        </a>
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
