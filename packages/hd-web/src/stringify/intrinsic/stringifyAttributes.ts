import type { CssProperties, HtmlAttributes } from '../../jsx/index.js'

export const stringifyStyle = (style: CssProperties): string => {
  let styleString = ' style="'
  for (const key in style) {
    const v = style[key as keyof CssProperties]
    if (v !== undefined) {
      styleString += `${key}:${v};`
    }
  }

  return styleString + '"'
}

export const stringifyAttribute = (
  key: string,
  value: string | number | boolean | URL | undefined | null
): string => {
  switch (typeof value) {
    case 'string':
    case 'number':
      return ` ${key}="${value}"`
    case 'boolean':
      if (value) {
        return ` ${key}`
      } else {
        return ''
      }
  }

  if (value === undefined || value === null) {
    return ''
  }

  // value is a url at this point
  return ` ${key}="${value.href}"`
}

export const stringifyAttributes = (
  attributes: Omit<HtmlAttributes, 'children'>
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
