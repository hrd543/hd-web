import { Fragment, HdElement } from '@hd-web/jsx'

import { stringifyComponent } from './component/stringifyComponent.js'
import { stringifyFragment } from './fragment/fragment.js'
import { stringifyIntrinsic } from './intrinsic/stringifyIntrinsic.js'
import { StringifyFunction, StringifyNodeOutput, FlatHdNode } from './types.js'
import { isNode } from './utils.js'

export const stringifyNode = async (
  root: HdElement,
  dev = false
): Promise<StringifyNodeOutput> => {
  const components = new Map<string, string>()

  let fullHtml = ''
  const stack: FlatHdNode[] = [root]

  while (stack.length) {
    const entry = stack.pop()!

    if (isNode(entry)) {
      const { nodes, html = '' } = await getStringifyNodeFunction(entry)(
        entry,
        components,
        dev
      )
      stack.push(...(nodes?.reverse() ?? []))
      fullHtml += html

      continue
    }

    fullHtml += entry ?? ''
  }

  return {
    components: components
      .entries()
      .map(([key, filename]) => ({ key, filename }))
      .toArray(),
    html: fullHtml
  }
}

const getStringifyNodeFunction = ({
  tag,
  enhancements
}: HdElement): StringifyFunction => {
  if (enhancements) {
    return stringifyComponent as StringifyFunction
  }

  if (tag === Fragment) {
    return stringifyFragment as StringifyFunction
  }

  return stringifyIntrinsic as StringifyFunction
}
