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
  interactive?: {
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

/*


InteractiveView component with `use` `as` and `with` props

e.g. <InteractiveView use={ButtonBehaviour} as="button" with={{title: "henry"}} />

Then some sort of `createRef` function to pass refs around as props.

Optionally a decorator within class methods to add a listener (will need to parse these myself I think)

class ButtonBehaviour {
  @on("click")
  handleClick(e) {
    console.log(e)
  }
}


*/
