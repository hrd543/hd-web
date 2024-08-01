import { html } from '../../util'
import { HeaderProps } from './types'
// import 'jsx'

export const Header = ({ items, logo }: HeaderProps) => (
  <nav class="Header">
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
)
