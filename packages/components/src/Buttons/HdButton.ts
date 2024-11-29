import { WebComponent } from '@hd-web/components'

export class HdButton extends WebComponent {
  static override _key = 'hd-button'
  private loading: boolean

  constructor() {
    super()

    this.initListener('button', 'click', this.handleClick.bind(this))
    this.loading = false
  }

  startLoading() {
    this.loading = true
    this.querySelector('button')?.classList.add('Button--loading')
  }

  stopLoading() {
    this.loading = false
    this.querySelector('button')?.classList.remove('Button--loading')
  }

  handleClick(e: MouseEvent) {
    // If we're loading, don't allow further clicks
    if (this.loading) {
      e.stopImmediatePropagation()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'hd-button': HdButton
  }
}
