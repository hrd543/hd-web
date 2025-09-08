import { type FuncComponent, registerClient } from 'hd-web'

import DuplicateClient from './Duplicate.client.js'

export const Duplicate: FuncComponent = () => {
  return <div>Duplicate</div>
}

registerClient(Duplicate, DuplicateClient)
