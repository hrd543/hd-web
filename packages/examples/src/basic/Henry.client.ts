import { Component } from 'hd-web'

export default class HenryClient extends Component {
  static key = 'Henry'

  handleClick() {
    console.log('hh')
    console.log(this.ref('span'))
  }
}
