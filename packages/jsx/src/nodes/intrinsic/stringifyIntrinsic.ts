import { BaseProps, ComponentListener, IComponent, Node } from '../../types.js'
import { listenerAttribute, refAttribute } from '../shared/constants.js'
import { RenderStackEntry, StringifyFunction } from '../types.js'
import { convertPropsToClient } from '../shared/convertPropsToClient.js'
import { closeIntrinsic, openIntrinsic } from './openAndCloseTag.js'
import { serialiseListeners } from '../shared/listeners.js'

export const stringifyIntrinsic: StringifyFunction<Node & { tag: string }> = (
  entry
) => {
  const [{ tag, children, props }, component, clientProps] = entry
  const modifiedProps = { ...props }

  const script = addPropsScript(clientProps)

  processListener(modifiedProps, component)
  processRef(modifiedProps)

  return {
    entries: [
      ...(script ? [script] : []),
      ...(children?.map<RenderStackEntry>((child) => [child, component]) ?? []),
      [closeIntrinsic(tag), component]
    ],
    html: openIntrinsic(tag, modifiedProps)
  }
}

const addPropsScript = (
  props?: BaseProps | null
): RenderStackEntry | undefined => {
  const stringified = convertPropsToClient(props)

  if (stringified) {
    return [
      {
        tag: 'script',
        children: [stringified],
        props: { type: 'application/json' }
      },
      null
    ]
  }
}

const processListener = (props: BaseProps, component: IComponent | null) => {
  const listeners: ComponentListener[] = []
  for (const propKey in props) {
    if (propKey.startsWith('$')) {
      // See if this needs to be typed better to avoid "as string"
      const method = props[propKey] as string

      if (!component) {
        throw new Error(
          `You can't specify listeners without a parent component.`
        )
      }

      if (!Object.hasOwn(component.prototype, method)) {
        throw new Error(`Component ${component.name} has no method ${method}`)
      }

      delete props[propKey]
      listeners.push([propKey.slice(1), method])
    }
  }

  if (listeners.length) {
    props[listenerAttribute] = serialiseListeners(listeners)
  }
}

const processRef = (props: BaseProps) => {
  if (props['ref']) {
    props[refAttribute] = props.ref
    delete props.ref
  }
}
