import { Behaviour } from 'hd-web'

export default class ComponentClient extends Behaviour<
  HTMLDivElement,
  { client: string }
> {
  static key = '_componentKey'

  constructor(e: HTMLDivElement) {
    super(e)

    this.el.addEventListener('click', this.handleClick)
    this.ref('newEvent')!.addEventListener(
      'newEvent',
      this.handleEvent.bind(this)
    )
    this.ref('props')!.addEventListener('props', this.handleProps.bind(this))

    console.log('running')
  }

  handleClick() {
    console.log('click')
  }

  handleEvent() {
    console.log(this.ref('element')!.id)
  }

  handleProps() {
    console.log(this.props.client)
    console.log((this.props as any).id)
  }
}
