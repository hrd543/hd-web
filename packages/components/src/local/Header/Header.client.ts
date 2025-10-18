import { Behaviour } from 'hd-web'

export default class HeaderBehaviour extends Behaviour {
  static key = 'hd-header'

  constructor(e: HTMLElement) {
    super(e)

    e.addEventListener('click', this.handleClick.bind(this))
  }

  private toggleMenu(menu: Element) {
    const links = this.ref('links')!

    links.classList.toggle('hd-header_links--show')
    menu.classList.toggle('MenuButton--open')
    menu.ariaExpanded = menu.ariaExpanded === 'true' ? 'false' : 'true'
  }

  handleClick(e: MouseEvent) {
    if (!e.target) {
      return
    }

    const menu = this.ref('menu')!
    const target = e.target as HTMLElement

    // Need to check what we clicked on. If it was a link,
    // then hide the menu
    if (target.tagName === 'A' || target.tagName === 'LI') {
      this.toggleMenu(menu)
    }

    if (menu.contains(target)) {
      this.toggleMenu(menu)
    }
  }
}
