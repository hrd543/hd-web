import { IComponent, Node } from '../../types.js'
import { idAttribute } from '../shared/constants.js'
import { StringifyFunction } from '../types.js'
import { ComponentWithRender } from './decorators.js'

export const stringifyComponent: StringifyFunction<
  Node & { tag: IComponent }
> = (entry, components) => {
  const [{ tag, props, children }] = entry
  // TODO Make sure component name is unique here
  components.set(tag.name, (tag as ComponentWithRender).filepath)

  if (!children || children.length !== 1) {
    throw new Error(`Component ${tag.name} must have one child`)
  }

  const child = children[0]!

  if (typeof child === 'string' || typeof child.tag !== 'string') {
    throw new Error(`Component ${tag.name} must have an intrinsic child`)
  }

  return {
    entries: [
      [
        { ...child, props: { ...child.props, [idAttribute]: tag.name } },
        tag,
        props
      ]
    ]
  }
}
