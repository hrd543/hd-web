import { type View, registerClient } from 'hd-web'

import UnusedClient from './Unused.client.js'

export const Unused: View = () => {
  return <div>Not used</div>
}

registerClient(Unused, UnusedClient)
