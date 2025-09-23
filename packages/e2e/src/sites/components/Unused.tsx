import { type View, Enhance } from 'hd-web'

import UnusedBehaviour from './Unused.client.js'

export const Unused: View = () => {
  return <Enhance.div with={UnusedBehaviour}>Not used</Enhance.div>
}
