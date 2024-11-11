import { WebComponent } from '../shared/index.js'

export class InteractiveHeader extends WebComponent {
  static override _key = 'hd-header'
  menu: HTMLElement | null
  buttonContainer: HTMLButtonElement | null

  constructor() {
    super()
    this.menu = null
    this.buttonContainer = null
    this.initListener(() => this, 'click', this.onClick.bind(this))
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

  override connect() {
    this.menu = this.querySelector('.Header_links')
    this.buttonContainer = this.querySelector('.MenuButton')
  }
}
