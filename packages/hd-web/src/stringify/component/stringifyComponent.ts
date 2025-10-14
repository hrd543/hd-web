import { HdElement, BaseProps } from '@hd-web/jsx'
import url from 'url'

import { HdError } from '../../errors/index.js'
import { StringifyFunction } from '../types.js'
import { serialiseProps } from '../shared/props.js'
import { flattenChildren } from '../shared/flattenChildren.js'

export const stringifyComponent: StringifyFunction<HdElement> = async (
  { enhancements, ...entry },
  components,
  dev
) => {
  const { behaviour, props: behaviourProps } = enhancements!
  const componentKey = behaviour.key

  const existing = components.get(componentKey)
  const filename = behaviour.__file
    ? url.fileURLToPath(behaviour.__file).replaceAll('\\', '/')
    : undefined

  // In dev, the __file prop may not be provided as it's only added
  // on build. In this case, we'll just import all components from the
  // user's src folder anyway
  if (filename) {
    if (existing && existing !== filename) {
      throw new HdError('comp.unique', componentKey)
    }

    components.set(componentKey, filename)
  } else {
    if (!dev) {
      throw new HdError('comp.filename', componentKey)
    }
  }

  const script = addPropsScript(behaviourProps)

  return {
    nodes: [
      {
        ...entry,
        children: flattenChildren([script, (await entry.children) ?? null])
      }
    ]
  }
}

const addPropsScript = (props?: BaseProps | null): HdElement | null => {
  const stringified = serialiseProps(props)

  if (stringified) {
    return {
      tag: 'script',
      children: [stringified],
      props: { type: 'application/json' }
    }
  }

  return null
}
