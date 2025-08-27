import './Henry.css'

import { FuncComponent } from '@hd-web/jsx'

import { registerClient } from '../client/index.js'
import HenryClient from './Henry.client.js'

export const Henry: FuncComponent = () => {
  return (
    <div>
      <button class="Henry" $click="handleClick">
        click
      </button>
      <span ref="span">I'm a span</span>
    </div>
  )
}

registerClient(Henry, HenryClient)
