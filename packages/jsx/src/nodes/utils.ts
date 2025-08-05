import { Node } from '../types.js'
import { RenderStackEntry } from './types.js'

export const addToMapArray = <T>(
  map: Map<string, T[]>,
  key: string,
  value: T
) => {
  const existing = map.get(key)

  if (existing) {
    existing.push(value)
  } else {
    map.set(key, [value])
  }
}

export const isNode = (x: RenderStackEntry): x is RenderStackEntry<Node> =>
  typeof x[0] === 'object' && x[0] !== null
