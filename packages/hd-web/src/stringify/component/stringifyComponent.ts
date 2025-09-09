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
  const flatChildren = flattenChildren(children)

  if (!flatChildren || flatChildren.length !== 1) {
    throw new Error(`Component ${tag.name} must have one child`)
  }

  const child = flatChildren[0]!

  if (typeof child === 'string' || typeof child.tag !== 'string') {
    throw new Error(`Component ${tag.name} must have an intrinsic child`)
  }

  const existing = components.get(tag.client.key)
  // Try the client component's file prop which will only be valid
  // in prod or external packages.
  const filename = (
    tag.client.__file ? url.fileURLToPath(tag.client.__file) : child.filename
  )?.replaceAll('\\', '/')

  if (!filename) {
    throw new HdError('comp.filename', tag.client.key)
  }

  if (existing && existing !== filename) {
    throw new Error(
      `The key "${tag.client.key}" is used by multiple client components.\nThese keys must be unique.`
    )
  }

  components.set(tag.client.key, filename)

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
