import { Component } from 'hd-web'

export default class ComponentClient extends Component {
  static key = '_componentKey'

  constructor(e: HTMLElement | SVGElement) {
    super(e)

    console.log('running')
  }

  handleClick() {
    console.log('click')
  }

  handleEvent() {
    console.log(this.ref('element')!.id)
  }
}
