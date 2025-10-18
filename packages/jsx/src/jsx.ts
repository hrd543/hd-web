import type { HdElement, Props, AsyncView } from './types.js'

// TODO sort out filenames in dev.

export const jsx = (tag: string | AsyncView, props: Props): HdElement => {
  const { children, ...rest } = props
  const isView = typeof tag === 'function'

  if (isView) {
    return {
      tag: Fragment,
      props: rest,
      children: tag(props)
    }
  }

  return {
    tag,
    props: rest,
    children
  }
}

export const Fragment = 'FRAGMENT'

export const jsxs = jsx
export const jsxDEV = jsx
