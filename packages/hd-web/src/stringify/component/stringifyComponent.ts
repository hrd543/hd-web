import { FuncComponent, HdElement, IComponent } from '@hd-web/jsx'
import url from 'url'

import { HdError } from '../../errors/index.js'
import { idAttribute } from '../constants.js'
import { flattenChildren } from '../shared/flattenChildren.js'
import { StringifyFunction } from '../types.js'

export const stringifyComponent: StringifyFunction<
  HdElement & { tag: FuncComponent & { client: IComponent } }
> = (entry, components) => {
  const [{ tag, props, children }] = entry
  const componentKey = tag.client.key
  const flatChildren = flattenChildren(children)

  if (!flatChildren || flatChildren.length !== 1) {
    throw new HdError('comp.oneChild', componentKey)
  }

  const child = flatChildren[0]!

  if (typeof child === 'string' || typeof child.tag !== 'string') {
    throw new HdError('comp.intrinsicChild', componentKey)
  }

  const existing = components.get(componentKey)
  // Try the client component's file prop which will only be valid
  // in prod or external packages.
  const filename = (
    tag.client.__file ? url.fileURLToPath(tag.client.__file) : child.filename
  )?.replaceAll('\\', '/')

  if (!filename) {
    throw new HdError('comp.filename', componentKey)
  }

  if (existing && existing !== filename) {
    throw new HdError('comp.unique', componentKey)
  }

  components.set(componentKey, filename)

  return {
    entries: [
      [
        { ...child, props: { ...child.props, [idAttribute]: componentKey } },
        tag,
        props
      ]
    ]
  }
}
