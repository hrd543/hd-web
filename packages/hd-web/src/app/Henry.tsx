import { FuncComponent } from '@hd-web/jsx'
import { registerClient } from '../client/index.js'
import HenryClient from './Henry.client.js'

export const Henry: FuncComponent = () => {
  return (
    <div>
      <button $click="handleClick">click</button>
    </div>
  )
}

registerClient(Henry, HenryClient)
