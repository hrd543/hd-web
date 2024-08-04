import * as JSX from './jsx.js'

export const jsx = (
  type: string | JSX.Component,
  props: JSX.Props | null
): string => {
  if (typeof type === 'function') {
    return type(props ?? {}) ?? ''
  }

  return type
}
export const Fragment = ({ children }: { children?: JSX.Children }): string => {
  if (!children) {
    return ''
  }

  if (Array.isArray(children)) {
    return children.join('')
  }

  return children
}
export const jsxs = jsx
