import { FuncComponent, HdElement, WithChildren } from './types.js'
import type * as Html from './html.js'

type HtmlIntrinsicElementsMap = {
  [K in keyof HTMLElementTagNameMap]: WithChildren<Html.HTMLElements[K]>
}

type SvgIntrinsicElementsMap = {
  [K in keyof SVGElementTagNameMap]: WithChildren<Html.SVGElements[K]>
}

type IntrinsicElementsMap = HtmlIntrinsicElementsMap & SvgIntrinsicElementsMap

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IntrinsicElements extends IntrinsicElementsMap {}

export interface ElementChildrenAttribute {
  children: object
}

export type Element = HdElement

export type ElementType = string | FuncComponent<any>
