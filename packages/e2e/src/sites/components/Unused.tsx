import { type FuncComponent, registerClient } from 'hd-web'

import UnusedClient from './Unused.client.js'

export const Unused: FuncComponent = () => {
  return <div>Not used</div>
}

registerClient(Unused, UnusedClient)
