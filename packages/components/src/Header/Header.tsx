import './Header.css'
import { JSX } from '@hd-web/jsx'
import type { HeaderProps } from './types.js'
import { InteractiveHeader } from './InteractiveHeader.js'

export const Header: JSX.Component<HeaderProps> = ({
  items,
  logo,
  className
}) => (
  <InteractiveHeader.key>
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
        <div class="Header_menuButton">Menu</div>
      </div>
    </nav>
  </InteractiveHeader.key>
)
