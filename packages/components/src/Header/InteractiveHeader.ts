import { WebComponent } from '../shared/index.js'

export class InteractiveHeader extends WebComponent {
  protected static get _key() {
    return 'hd-header' as const
  }
  menu: HTMLElement | null
  buttonContainer: HTMLButtonElement | null

  constructor() {
    super()
    this.menu = null
    this.buttonContainer = null
  }

  showHideMenu(show: boolean) {
    const type = show ? 'add' : 'remove'
    this.menu?.classList[type]('Header_links-show')
    this.buttonContainer?.classList[type]('MenuButton-open')
  }

  onClick(e: MouseEvent) {
    if (!this.menu || !this.buttonContainer || !e.target) {
      return
    }

    const target = e.target as Element

    // Need to check what we clicked on. If it was a link,
    // then hide the menu
    if (target.tagName === 'A' || target.tagName === 'LI') {
      this.showHideMenu(false)
    }

    // If the menu button, then show/hide
    if (this.buttonContainer.contains(target)) {
      if (this.menu.classList.contains('Header_links-show')) {
        this.showHideMenu(false)
      } else {
        this.showHideMenu(true)
      }
    }
  }

  connectedCallback() {
    this.menu = this.querySelector('.Header_links')
    this.buttonContainer = this.querySelector('.MenuButton')
    this.addEventListener('click', this.onClick.bind(this))
  }

  disconnectedCallback() {
    this.menu = null
    this.buttonContainer = null
    this.removeEventListener('click', this.onClick)
  }
}

declare module '@hd-web/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'hd-header': object
    }
  }
}
