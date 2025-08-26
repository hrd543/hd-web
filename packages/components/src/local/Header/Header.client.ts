import { Component, Html } from 'hd-web'
import { HeaderProps } from './types.js'

export default class HeaderClient extends Component<HeaderProps> {
  static key = 'hd-header'

  private toggleMenu(menu: Element) {
    const links = this.ref('links')!

    links.classList.toggle('hd-header_links--show')
    menu.classList.toggle('MenuButton--open')
    menu.ariaExpanded = menu.ariaExpanded === 'true' ? 'false' : 'true'
  }

  handleClick(e: Html.TypedMouseEvent<HTMLDivElement>) {
    if (!e.target) {
      return
    }

    const menu = this.ref('menu')!

    // Need to check what we clicked on. If it was a link,
    // then hide the menu
    if (e.target.tagName === 'A' || e.target.tagName === 'LI') {
      this.toggleMenu(menu)
    }

    if (menu.contains(e.target)) {
      this.toggleMenu(menu)
    }
  }
}
