import { Component } from 'hd-web'

export default class FormClient extends Component {
  static key = 'Form'

  handleClick() {
    const input = this.ref('input') as HTMLInputElement

    console.log(input.value)
  }
}
