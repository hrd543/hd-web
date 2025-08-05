import type { ComponentWithRender } from './nodes/index.js'
import type {
  BaseProps,
  Child,
  Children,
  FuncComponent,
  Node,
  Props
} from './types.js'

const convertChild = (children: Children | undefined): Child[] | undefined => {
  if (!children) {
    return
  }

  // @ts-expect-error Shouldn't happen in practice
  return [children].flat(Infinity)
}

export const jsx = <T extends BaseProps>(
  tag: string | ComponentWithRender<T> | FuncComponent<T>,
  props: Props<T>
  // Don't support key for now
): Node<T> => {
  const { children, ...rest } = props

  // If this is a functional component, treat it as a fragment
  if (typeof tag === 'function' && !('render' in tag)) {
    return {
      tag: Fragment,
      props: rest as T,
      children: convertChild(tag(props))
    }
  }

  return {
    tag,
    props: rest as T,
    children: convertChild(
      typeof tag === 'string' ? children : tag.render(props)
    )
  }
}

export const Fragment = 'FRAGMENT'

export const jsxs = jsx
export const jsxDEV = jsx
