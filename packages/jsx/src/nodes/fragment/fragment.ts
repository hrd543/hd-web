import { Node } from '../../types.js'
import { flattenChildren } from '../shared/flattenChildren.js'
import { StringifyFunction } from '../types.js'

export const Fragment = 'FRAGMENT'

export const stringifyFragment: StringifyFunction<Node & { tag: string }> = (
  entry
) => {
  const [{ children }, key] = entry

  return {
    entries: flattenChildren(children)?.map((child) => [child, key])
  }
}
