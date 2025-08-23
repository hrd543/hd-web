import { Component, Html } from 'hd-web'
import { ButtonProps } from './types.js'
import { isLoading } from './utils.js'

export default class ButtonClient extends Component<ButtonProps> {
  static key = 'hd-button'

  click(e: Html.TypedMouseEvent<HTMLButtonElement>) {
    // If we're loading, don't allow further clicks
    if (isLoading(e.currentTarget!)) {
      e.stopImmediatePropagation()
    }
  }
}
