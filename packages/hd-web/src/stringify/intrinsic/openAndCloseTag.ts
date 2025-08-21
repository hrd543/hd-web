import { Html } from '@hd-web/jsx'
import { stringifyAttributes } from './stringifyAttributes.js'

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

export const openIntrinsic = (tag: string, props: Record<string, unknown>) => {
  const result = `<${tag}${stringifyAttributes(props as Html.AllAttributes)}`

  if (voidElements.has(tag)) {
    return `${result} />`
  }

  return `${result}>`
}

export const closeIntrinsic = (tag: string) => {
  if (voidElements.has(tag)) {
    return ''
  }

  return `</${tag}>`
}
