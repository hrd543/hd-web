import { Node } from '../jsx/index.js'
import { RenderStackEntry } from './types.js'

export const isNode = (x: RenderStackEntry): x is RenderStackEntry<Node> =>
  typeof x[0] === 'object' && x[0] !== null
