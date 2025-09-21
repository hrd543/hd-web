import { type View, registerClient } from 'hd-web'

import DuplicateClient from './Duplicate.client.js'

export const Duplicate: View = () => {
  return <div>Duplicate</div>
}

registerClient(Duplicate, DuplicateClient)
