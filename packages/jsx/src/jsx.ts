import * as Html from '@michijs/htmltype'
import * as Css from 'csstype'

export type Primitive = string | number | boolean | null | undefined
export type Element = string | null
export type Children = Element | Element[] | undefined

export interface IntrinsicElements extends IntrinsicElementsMap {}

type IntrinsicElementsMap = {
  [K in keyof Html.HTMLElements]: Omit<Html.HTMLElements[K], 'style'> & {
    children?: Children
    style?: Css.PropertiesHyphen
  }
}

export interface ElementChildrenAttribute {
  children: {}
}

type BaseProps = Record<string, unknown>

export type Props<T extends BaseProps = BaseProps> = T & {
  children?: Children
}

export type Component<T extends BaseProps = BaseProps> = (
  props: Props<T>
) => Element
