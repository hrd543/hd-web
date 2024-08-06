import * as JSX from './types.js'
import { stringifyAttributes } from './stringify.js'
import { voidElements } from './constants.js'

export const jsx = (
  type: string | JSX.Component,
  props: JSX.Props | JSX.WithChildren<JSX.HtmlAttributes> | null
): string => {
  if (typeof type === 'function') {
    return type((props ?? {}) as JSX.Props) ?? ''
  }

  const { children, ...rest } = (props ??
    {}) as JSX.WithChildren<JSX.HtmlAttributes>
  const stringified = `<${type}${stringifyAttributes(rest)}`

  if (voidElements.has(type)) {
    return stringified + ' />'
  }

  return `${stringified}>${Fragment({ children })}</${type}>`
}

export const Fragment = ({ children }: JSX.WithChildren): string => {
  if (!children) {
    return ''
  }

  if (Array.isArray(children)) {
    return children.reduce<string>((all, child) => all + (child ?? ''), '')
  }

  return children
}

export const jsxs = jsx
