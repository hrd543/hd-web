import { HdElement } from '@hd-web/jsx'
import { RenderStackEntry } from './types.js'

export const isNode = (x: RenderStackEntry): x is RenderStackEntry<HdElement> =>
  typeof x[0] === 'object' && x[0] !== null
