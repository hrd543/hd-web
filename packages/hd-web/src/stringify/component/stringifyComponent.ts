import { HdElement, BaseProps } from '@hd-web/jsx'
import url from 'url'

import { HdError } from '../../errors/index.js'
import { StringifyFunction } from '../types.js'
import { serialiseProps } from '../shared/props.js'

export const stringifyComponent: StringifyFunction<HdElement> = (
  { interactive, ...entry },
  components
) => {
  const { behaviour, props: behaviourProps } = interactive!
  const componentKey = behaviour.key

  const existing = components.get(componentKey)
  const filename = url.fileURLToPath(behaviour.__file!).replaceAll('\\', '/')

  if (!filename) {
    throw new HdError('comp.filename', componentKey)
  }

  if (existing && existing !== filename) {
    throw new HdError('comp.unique', componentKey)
  }

  components.set(componentKey, filename)

  const script = addPropsScript(behaviourProps)

  return {
    nodes: [...(script ? [script] : []), entry]
  }
}

const addPropsScript = (props?: BaseProps | null): HdElement | undefined => {
  const stringified = serialiseProps(props)

  if (stringified) {
    return {
      tag: 'script',
      children: [stringified],
      props: { type: 'application/json' }
    }
  }
}
