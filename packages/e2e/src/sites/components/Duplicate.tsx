import { type View, Enhance } from 'hd-web'

import DuplicateBehaviour from './Duplicate.client.js'

export const Duplicate: View = () => {
  return <Enhance.div with={DuplicateBehaviour}>Duplicate</Enhance.div>
}
