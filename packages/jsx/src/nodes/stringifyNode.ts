import { Fragment } from '../jsx.js'
import { Node } from '../types.js'
import { stringifyComponent } from './component/stringifyComponent.js'
import { stringifyFragment } from './fragment/fragment.js'
import { stringifyIntrinsic } from './intrinsic/stringifyIntrinsic.js'
import {
  RenderStackEntry,
  RenderToStringOutput,
  StringifyFunction
} from './types.js'
import { isNode } from './utils.js'

export const renderToString = (root: Node): RenderToStringOutput => {
  const components = new Map<string, string>()

  let fullHtml = ''
  const stack: RenderStackEntry[] = [[root, null]]

  while (stack.length) {
    const entry = stack.pop()!

    if (isNode(entry)) {
      const { entries, html = '' } = getStringifyNodeFunction(entry[0].tag)(
        entry,
        components
      )
      stack.push(...(entries?.reverse() ?? []))
      fullHtml += html

      continue
    }

    fullHtml += entry[0] ?? ''
  }

  return {
    components,
    html: fullHtml
  }
}

const getStringifyNodeFunction = (tag: Node['tag']): StringifyFunction => {
  if (typeof tag === 'function') {
    return stringifyComponent as StringifyFunction
  }

  if (tag === Fragment) {
    return stringifyFragment as StringifyFunction
  }

  return stringifyIntrinsic as StringifyFunction
}
