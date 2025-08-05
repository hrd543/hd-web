import type * as Html from '@michijs/htmltype'
import type * as Css from 'csstype'

export type ComponentListener = [event: string, method: string]

export type DomElement = SVGElement | HTMLElement

export interface IComponentInstance<T extends BaseProps = BaseProps> {
  /** DO NOT USE - INTERNAL ONLY */
  __props: T
}

export interface IComponent<
  T extends BaseProps = BaseProps,
  E extends DomElement = DomElement
> {
  new (element: E): IComponentInstance<T>
}

export type ComponentRenderFunction<T extends BaseProps = BaseProps> =
  FuncComponent<T>

/**
 * Internal representation of an element
 */
export type Node<T extends BaseProps = BaseProps> = {
  tag: string | IComponent<T>
  props: T | null
  children?: Child[]
}

export type Primitive = string | null
export type Child = Node | Primitive
export type Children = Child | Child[]
export type Element = Children

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IntrinsicElements extends IntrinsicElementsMap {}

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

export interface ElementChildrenAttribute {
  children: object
}

// Used for class components to declare the props type
export interface ElementAttributesProperty {
  __props: unknown
}

export type BaseProps = {
  key?: never
  [x: string]: unknown
  [x: ClientPropKey]: string
}

export type Props<T extends BaseProps = BaseProps> = WithChildren<T>

export type FuncComponent<T extends BaseProps = BaseProps> = (
  props: Props<T>
) => Children

// Only props which start with _ are sent to the client.
export type ClientPropKey = `_${string}`

type ClientKeys<T> = {
  [K in keyof T]: K extends ClientPropKey ? K : never
}[keyof T]

export type ClientProps<T> = {
  [K in ClientKeys<T>]: string
}

export type * from '@michijs/htmltype'
