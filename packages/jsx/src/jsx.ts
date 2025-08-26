import type { FuncComponent, HdElement, Props } from './types.js'

export const jsx = (
  tag: string | FuncComponent,
  props: Props,
  key?: string,
  x?: boolean,
  source?: { fileName: string }
): HdElement => {
  const { children, ...rest } = props
  const isFunction = typeof tag === 'function'

  if (isFunction && tag.client) {
    return {
      tag,
      props: rest,
      children: tag(props)
    }
  }

  // If this is a standard functional component, treat it as a fragment
  if (isFunction) {
    return {
      tag: Fragment,
      props: rest,
      children: tag(props)
    }
  }

  return {
    tag,
    props: rest,
    children,
    filename: source?.fileName
  }
}

export const Fragment = 'FRAGMENT'

export const jsxs = jsx
export const jsxDEV = jsx
