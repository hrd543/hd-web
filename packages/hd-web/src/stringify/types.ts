import { BaseProps, FuncComponent, HdNode } from '@hd-web/jsx'

type StringifyResult = {
  entries?: RenderStackEntry[]
  html?: string
}

type Flattened<T> = T extends Array<unknown> ? never : T

export type FlatHdNode = Flattened<HdNode>

export type RenderStackEntry<
  T extends FlatHdNode = FlatHdNode,
  P extends BaseProps = BaseProps
> = [element: T, component: FuncComponent<P> | null, props?: P | null]

export type ComponentInfo = {
  filename: string
  key: string
}

export type StringifyFunction<T extends FlatHdNode = FlatHdNode> = (
  entry: RenderStackEntry<T>,
  components: ComponentInfo[]
) => StringifyResult

export type StringifyNodeOutput = {
  /** Information about each instance encountered of a component. */
  components: ComponentInfo[]
  /** The stringified html */
  html: string
}

export type ComponentListener = [event: string, method: string]
