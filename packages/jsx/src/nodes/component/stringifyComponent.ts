import { IComponent, Node } from '../../types.js'
import { idAttribute } from '../shared/constants.js'
import { flattenChildren } from '../shared/flattenChildren.js'
import { StringifyFunction } from '../types.js'
import { ComponentWithRender } from './decorators.js'

export const stringifyComponent: StringifyFunction<
  Node & { tag: IComponent }
> = (entry, components) => {
  const [{ tag: rawTag, props, children }] = entry
  const tag = rawTag as ComponentWithRender
  // TODO Make sure component name is unique here
  components.set(tag.__name, tag.name)
  const flatChildren = flattenChildren(children)

  if (!flatChildren || flatChildren.length !== 1) {
    throw new Error(`Component ${tag.__name} must have one child`)
  }

  const child = flatChildren[0]!

  if (typeof child === 'string' || typeof child.tag !== 'string') {
    throw new Error(`Component ${tag.__name} must have an intrinsic child`)
  }

  return {
    entries: [
      [
        { ...child, props: { ...child.props, [idAttribute]: tag.__name } },
        tag,
        props
      ]
    ]
  }
}
