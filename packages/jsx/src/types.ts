export interface IComponent<
  E extends SVGElement | HTMLElement = SVGElement | HTMLElement
> {
  new (element: E): object
  key: string
  /**
   * Injected automatically at build time.
   *
   * Represents the defining file path
   */
  __file?: string
}

/**
 * Internal representation of an element
 */
export type HdElement<T extends BaseProps = BaseProps> = {
  tag: string | FuncComponent<T>
  props: T | null
  children?: HdNode
  // In dev mode, we can quickly get the file path using jsxDEV
  filename?: string
}

export type Primitive = string | null
export type HdNode = HdElement | Primitive | Array<HdNode>

export type WithChildren<T = object> = T & {
  children?: HdNode
}

export type BaseProps = {
  key?: never
  [x: string]: unknown
  [x: ClientPropKey]: string
}

export type Props<T extends BaseProps = BaseProps> = WithChildren<T>

export interface FuncComponent<T extends BaseProps = BaseProps> {
  (props: Props<T>): HdNode
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
