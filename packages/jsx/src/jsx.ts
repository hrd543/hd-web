import type { ComponentWithRender } from './nodes/index.js'
import type { FuncComponent, Element, Props } from './types.js'

export const jsx = (
  tag: string | ComponentWithRender | FuncComponent,
  props: Props
  // Don't support key for now
): Element => {
  const { children, ...rest } = props

  // If this is a functional component, treat it as a fragment
  if (typeof tag === 'function' && !('__render' in tag)) {
    return {
      tag: Fragment,
      props: rest,
      children: tag(props)
    }
  }

  return {
    tag,
    props: rest,
    children: typeof tag === 'string' ? children : tag.__render(props)
  }
}

export const Fragment = 'FRAGMENT'

export const jsxs = jsx
export const jsxDEV = jsx
