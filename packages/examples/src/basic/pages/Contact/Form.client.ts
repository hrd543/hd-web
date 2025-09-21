import { Behaviour } from 'hd-web'

export default class FormBehaviour extends Behaviour {
  static key = 'Form'

  constructor(e: HTMLButtonElement) {
    super(e)
    this.el.addEventListener('click', this.handleClick.bind(this))
  }

  handleClick() {
    // This is accessible since we defined `ref="input"`
    // on the input element
    const input = this.ref('input') as HTMLInputElement

    console.log(input.value)
  }
}
