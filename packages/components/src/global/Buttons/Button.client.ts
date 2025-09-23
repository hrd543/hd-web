import { Behaviour, Html } from 'hd-web'

import { isLoading } from './utils.js'

export default class ButtonBehaviour extends Behaviour {
  static key = 'hd-button'

  click(e: Html.TypedMouseEvent<HTMLButtonElement>) {
    // If we're loading, don't allow further clicks
    if (isLoading(e.currentTarget!)) {
      e.stopImmediatePropagation()
    }
  }
}
