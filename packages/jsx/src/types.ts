import type * as Html from '@michijs/htmltype'
import type * as Css from 'csstype'

export type Primitive = string | number | boolean | null | undefined
export type Element = string | null
export type Children = Element | Element[] | undefined

export type WithChildren<T = {}> = T & { children?: Children }
export type HtmlAttributes = Html.AllAttributes
export type CssProperties = Css.PropertiesHyphen

export interface IntrinsicElements extends IntrinsicElementsMap {}

type IntrinsicElementsMap = {
  [K in keyof Html.HTMLElements]: WithChildren<
    Omit<Html.HTMLElements[K], 'style'> & {
      style?: Css.PropertiesHyphen
    }
  >
}

export interface ElementChildrenAttribute {
  children: {}
}

type BaseProps = Record<string, unknown>

export type Props<T extends BaseProps = BaseProps> = WithChildren<T>
export type Component<T extends BaseProps = BaseProps> = (
  props: Props<T>
) => Element
