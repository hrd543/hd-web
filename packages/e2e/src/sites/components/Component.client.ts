import { Component } from 'hd-web'

export type ComponentProps = {
  id: number
  _client: string
}

export default class ComponentClient extends Component<ComponentProps> {
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

  handleProps() {
    console.log(this.props._client)
    console.log((this.props as any).id)
  }
}
