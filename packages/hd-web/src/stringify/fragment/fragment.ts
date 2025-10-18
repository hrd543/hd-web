import { HdElement } from '@hd-web/jsx'

import { flattenChildren } from '../shared/flattenChildren.js'
import { StringifyFunction } from '../types.js'

export const Fragment = 'FRAGMENT'

export const stringifyFragment: StringifyFunction<HdElement> = async (
  entry
) => {
  return {
    nodes: flattenChildren(await entry.children)
  }
}
