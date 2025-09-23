import { Behaviour } from 'hd-web'

export default class UnusedClient extends Behaviour {
  static key = '_unusedKey'

  constructor(e: HTMLElement) {
    super(e)

    console.log('unused')
  }
}
