export * from '@michijs/htmltype'

import type * as HtmlInternal from '@michijs/htmltype'
import type * as CssInternal from 'csstype'

// TODO: improve this by actually defining my own html types.
// This looks a bit naff when you hover intrinsic elements.

type ListenerKey = `$${string}`

type HdAttributes = {
  [key: ListenerKey]: string
  ref?: string
  style?: CssProperties
}

export type CssProperties = CssInternal.PropertiesHyphen & {
  // allow css variables
  [x: `--${string}`]: string
}

export type AllAttributes = HtmlInternal.AllAttributes & HdAttributes

export type SVGElements = {
  [K in keyof HtmlInternal.SVGElements]: Omit<
    HtmlInternal.SVGElements[K],
    'style'
  > &
    HdAttributes
}

export type HTMLElements = {
  [K in keyof HtmlInternal.HTMLElements]: Omit<
    HtmlInternal.HTMLElements[K],
    'style'
  > &
    HdAttributes
}
