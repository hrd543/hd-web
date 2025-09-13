import { Component } from 'hd-web'

export default class FormClient extends Component {
  static key = 'Form'

  // Make sure this method matches the $click="..."
  handleClick() {
    // This is accessible since we defined `ref="input"`
    // on the input element
    const input = this.ref('input') as HTMLInputElement

    console.log(input.value)
  }
}
