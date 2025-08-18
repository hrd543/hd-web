import { FuncComponent, registerClient } from '@hd-web/jsx'
import HenryClient from './Henry.client.js'

export const Henry: FuncComponent = () => {
  return (
    <div>
      <button $click="handleClick">click</button>
    </div>
  )
}

registerClient(Henry, HenryClient)
