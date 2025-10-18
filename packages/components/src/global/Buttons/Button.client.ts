import { Behaviour } from 'hd-web'

import { isLoading } from './utils.js'

export default class ButtonBehaviour extends Behaviour {
  static key = 'hd-button'

  constructor(e: HTMLElement) {
    super(e)
    e.addEventListener('click', this.click.bind(this))
  }

  click(e: MouseEvent) {
    // If we're loading, don't allow further clicks
    if (isLoading(e.currentTarget as Element)) {
      e.stopImmediatePropagation()
    }
  }
}
