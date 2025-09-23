import { HdElement } from '@hd-web/jsx'

import { FlatHdNode } from './types.js'

export const isNode = (x: FlatHdNode): x is HdElement =>
  typeof x === 'object' && x !== null
