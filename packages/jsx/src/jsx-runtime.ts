import * as JSX from './jsx.js'

const stringifyStyle = (style: JSX.CssProperties): string => {
  let styleString = ' style="'
  for (const key in style) {
    const v = style[key as keyof JSX.CssProperties]
    styleString += `${key}:${v};`
  }

  return styleString + '"'
}

const stringifyAttribute = (
  key: string,
  value: string | number | boolean | URL | undefined
): string => {
  switch (typeof value) {
    case 'string':
    case 'number':
      return ` ${key}="${value}"`
    case 'boolean':
      if (value) {
        return ` ${key}`
      } else {
        return ` ${key}="false"`
      }
  }

  if (value === undefined) {
    return ''
  }

  // value is a url at this point
  return ` ${key}="${value.href}"`
}

const stringifyAttributes = (
  attributes: Omit<JSX.HtmlAttributes, 'children'>
): string => {
  if (Object.keys(attributes).length === 0) {
    return ''
  }

  let stringified = ''

  const { style, ...rest } = attributes
  if (style) {
    stringified += stringifyStyle(style)
  }

  for (const key in rest) {
    stringified += stringifyAttribute(key, attributes[key as keyof typeof rest])
  }

  return stringified
}

const voidElements = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr'
])

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
export const Fragment = ({ children }: { children?: JSX.Children }): string => {
  if (!children) {
    return ''
  }

  if (Array.isArray(children)) {
    return children.reduce<string>((all, child) => all + (child ?? ''), '')
  }

  return children
}
export const jsxs = jsx
