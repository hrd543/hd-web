import type * as Html from '@michijs/htmltype'
import type * as Css from 'csstype'

export interface IComponent<
  E extends SVGElement | HTMLElement = SVGElement | HTMLElement
> {
  new (element: E): object
  key: string
  /** Only used internally in build */
  __file?: string
}

/**
 * Internal representation of an element
 */
export type Node<T extends BaseProps = BaseProps> = {
  tag: string | FuncComponent<T>
  props: T | null
  children?: Children
  // only used in dev
  filename?: string
}

export type Primitive = string | null
export type Child = Node | Primitive
export type Children = Child | Child[]

export type WithChildren<T = object> = T & {
  children?: Children
}

export type HtmlAttributes = Html.AllAttributes & {
  style?: CssProperties
}

export type CssProperties = Css.PropertiesHyphen & {
  // allow css variables
  [x: `--${string}`]: string
}

type IntrinsicElementsMap = HtmlIntrinsicElementsMap & SvgIntrinsicElementsMap

type ListenerKey = `$${string}`

type HtmlIntrinsicElementsMap = {
  [K in keyof HTMLElementTagNameMap]: WithChildren<
    Omit<Html.HTMLElements[K], 'style'> & {
      [key: ListenerKey]: string
      ref?: string
      style?: CssProperties
    }
  >
}

type SvgIntrinsicElementsMap = {
  [K in keyof SVGElementTagNameMap]: WithChildren<
    Omit<Html.SVGElements[K], 'style'> & {
      [key: ListenerKey]: string
      ref?: string
      style?: CssProperties
    }
  >
}

export type BaseProps = {
  key?: never
  [x: string]: unknown
  [x: ClientPropKey]: string
}

export type Props<T extends BaseProps = BaseProps> = WithChildren<T>

export interface FuncComponent<T extends BaseProps = BaseProps> {
  (props: Props<T>): Children
  client?: IComponent
}

// Only props which start with _ are sent to the client.
export type ClientPropKey = `_${string}`

type ClientKeys<T> = {
  [K in keyof T]: K extends ClientPropKey ? K : never
}[keyof T]

export type ClientProps<T> = {
  [K in ClientKeys<T>]: string
}

export type * from '@michijs/htmltype'

// These are TS specific types within the JSX namespace to make
// the typing work properly.

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IntrinsicElements extends IntrinsicElementsMap {}

export interface ElementChildrenAttribute {
  children: object
}

export type Element = Node

export type ElementType = string | FuncComponent<any>
