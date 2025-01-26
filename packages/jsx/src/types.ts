import type * as Html from '@michijs/htmltype'
import type * as Css from 'csstype'

export type Primitive = string | number | boolean | null | undefined
export type Element = string | null
export type Children = Element | Element[] | undefined | Children[]

export type WithChildren<T = object> = T & {
  children?: Children
}
export type HtmlAttributes = Html.AllAttributes
export type CssProperties = Css.PropertiesHyphen & {
  // allow css variables
  [x: `--${string}`]: any
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IntrinsicElements extends IntrinsicElementsMap {}

type IntrinsicElementsMap = HtmlIntrinsicElementsMap & SvgIntrinsicElementsMap

type HtmlIntrinsicElementsMap = {
  [K in keyof Html.HTMLElements]: WithChildren<
    Omit<Html.HTMLElements[K], 'style'> & {
      style?: CssProperties
    }
  >
}

type SvgIntrinsicElementsMap = {
  [K in keyof Html.SVGElements]: WithChildren<
    Omit<Html.SVGElements[K], 'style'> & {
      style?: CssProperties
    }
  >
}

export interface ElementChildrenAttribute {
  children: object
}

// Used for class components to declare the props type
export interface ElementAttributesProperty {
  props: object
}

type BaseProps = Record<string, unknown>

export type Props<T extends BaseProps = BaseProps> = WithChildren<T>
export type FuncComponent<T extends BaseProps = BaseProps> = (
  props: Props<T>
) => Element

export type ClassComponent<T extends BaseProps = BaseProps> = (new () => {
  props?: T
}) & { key: string }
