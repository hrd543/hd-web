import { WebComponent } from '../shared/index.js'

export class InteractiveHeader extends WebComponent {
  protected static get _key() {
    return 'hd-header' as const
  }
  menu: HTMLElement | null

  constructor() {
    super()
    this.menu = null
  }

  onClick(e: MouseEvent) {
    if (!this.menu || !e.target) {
      return
    }

    const target = e.target as Element

    // Need to check what we clicked on. If it was a link,
    // then hide the menu
    if (target.tagName === 'A' || target.tagName === 'LI') {
      this.menu.classList.remove('Header_links-show')
    }

    // If the menu button, then show/hide
    if (target.classList.contains('Header_menuButton')) {
      if (this.menu.classList.contains('Header_links-show')) {
        this.menu.classList.remove('Header_links-show')
      } else {
        this.menu.classList.add('Header_links-show')
      }
    }
  }

  connectedCallback() {
    this.menu = this.querySelector('.Header_links')
    this.addEventListener('click', this.onClick.bind(this))
  }

  disconnectedCallback() {
    this.menu = null
    this.removeEventListener('click', this.onClick.bind(this))
  }
}

declare module '@hd-web/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'hd-header': object
    }
  }
}
