import { FuncComponent, HdElement, IComponent } from '@hd-web/jsx'
import url from 'url'

import { idAttribute } from '../constants.js'
import { flattenChildren } from '../shared/flattenChildren.js'
import { StringifyFunction } from '../types.js'

export const stringifyComponent: StringifyFunction<
  HdElement & { tag: FuncComponent & { client: IComponent } }
> = (entry, components) => {
  const [{ tag, props, children }] = entry
  const flatChildren = flattenChildren(children)

  if (!flatChildren || flatChildren.length !== 1) {
    throw new Error(`Component ${tag.name} must have one child`)
  }

  const child = flatChildren[0]!

  if (typeof child === 'string' || typeof child.tag !== 'string') {
    throw new Error(`Component ${tag.name} must have an intrinsic child`)
  }

  // TODO Make sure component name is unique here
  components.push({
    // Try the client component's file prop which will only be valid
    // in prod or external packages.
    filename: (tag.client.__file
      ? url.fileURLToPath(tag.client.__file)
      : child.filename!
    ).replaceAll('\\', '/'),
    key: tag.client.key
  })

  return {
    entries: [
      [
        { ...child, props: { ...child.props, [idAttribute]: tag.client.key } },
        tag,
        props
      ]
    ]
  }
}
