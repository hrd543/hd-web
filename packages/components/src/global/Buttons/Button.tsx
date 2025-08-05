import { Component, JSX, Template } from '@hd-web/jsx'
import { ButtonType } from './types.js'
import { isLoading } from './utils.js'

export type ButtonProps = {
  type: ButtonType
  disabled?: boolean
  title: string
}

@Template({
  render: ({ type, disabled = false, title }) => {
    return (
      <button
        $click="click"
        disabled={disabled}
        class={`Button Button--${type}`}
      >
        {title}
      </button>
    )
  }
})
export class Button extends Component<ButtonProps> {
  click(e: JSX.TypedMouseEvent<HTMLButtonElement>) {
    // If we're loading, don't allow further clicks
    if (isLoading(e.currentTarget!)) {
      e.stopImmediatePropagation()
    }
  }
}
