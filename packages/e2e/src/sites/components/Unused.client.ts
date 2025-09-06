import { Component } from 'hd-web'

export default class UnusedClient extends Component {
  static key = '_unusedKey'

  constructor(e: HTMLElement | SVGElement) {
    super(e)

    console.log('unused')
  }
}
