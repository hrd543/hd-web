export type IBehaviour<T extends BaseProps> = {
  readonly props: T
}

export type IBehaviourConstructor<
  E extends keyof HTMLElementTagNameMap,
  P extends BaseProps
> = {
  new (element: HTMLElementTagNameMap[E]): IBehaviour<P>
  key: string
  /** Used internally to track behaviour usage */
  __file?: string
}

/**
 * Internal representation of an element
 */
export type HdElement<T extends BaseProps = BaseProps> = {
  tag: string
  props: T | null
  children?: HdNode
  enhancements?: {
    behaviour: IBehaviourConstructor<any, any>
    props: any
  }
}

export type Primitive = string | null
export type HdNode = HdElement | Primitive | Array<HdNode>

export type WithChildren<T = object> = T & {
  children?: HdNode
}

export type BaseProps = {
  [x: string]: unknown
}

export type Props<T extends BaseProps = BaseProps> = WithChildren<T>

export interface View<T extends BaseProps = BaseProps> {
  (props: Props<T>): HdNode
}
