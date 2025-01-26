import type * as JSX from './types.js'
import { stringifyAttributes } from './stringify.js'
import { voidElements } from './constants.js'

export const jsx = (
  tag: string | JSX.FuncComponent | JSX.ClassComponent,
  props: JSX.Props | JSX.WithChildren<JSX.HtmlAttributes> | null
): string => {
  // If the tag is a component, we need to check whether class or functional
  if (typeof tag === 'function') {
    // If a class, all we need to do is use the key as the tag,
    // since the component will be dynamic and constructed at runtime
    if ('key' in tag) {
      return jsx(tag.key, props)
    }

    return tag((props ?? {}) as JSX.Props) ?? ''
  }

  const { children, ...rest } = (props ??
    {}) as JSX.WithChildren<JSX.HtmlAttributes>
  const stringified = `<${tag}${stringifyAttributes(rest)}`

  if (voidElements.has(tag)) {
    return stringified + ' />'
  }

  return `${stringified}>${Fragment({ children })}</${tag}>`
}

export const Fragment = ({ children }: JSX.WithChildren): string => {
  if (!children) {
    return ''
  }

  if (Array.isArray(children)) {
    return children.reduce<string>(
      (all, child) => all + Fragment({ children: child }),
      ''
    )
  }

  return children
}

export const jsxs = jsx
