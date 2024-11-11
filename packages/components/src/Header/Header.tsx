import './Header.css'
import { JSX } from '@hd-web/jsx'
import type { HeaderProps } from './types.js'
import { InteractiveHeader } from './InteractiveHeader.js'
import { MenuButton } from './MenuButton.js'

export const Header: JSX.FuncComponent<HeaderProps> = ({
  items,
  logo,
  className
}) => (
  <InteractiveHeader>
    <nav class={`Header ${className}`}>
      <div class="Header_container">
        <div class="Header_logo">{logo}</div>
        <ul class="Header_links">
          {items.map(({ link, title }) => (
            <li class="Header_item">
              <a href={link}>{title}</a>
            </li>
          ))}
        </ul>
        <MenuButton height={30} className="Header_menuButton" />
      </div>
    </nav>
  </InteractiveHeader>
)
