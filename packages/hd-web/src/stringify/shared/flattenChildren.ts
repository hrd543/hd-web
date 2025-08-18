import { HdNode } from '@hd-web/jsx'
import { FlatHdNode } from '../types.js'

export const flattenChildren = (
  children: HdNode | undefined
): FlatHdNode[] | undefined => {
  if (!children) {
    return
  }

  // @ts-expect-error Shouldn't happen in practice
  return [children].flat(Infinity)
}
