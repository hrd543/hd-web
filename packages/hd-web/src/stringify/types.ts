import { HdNode } from '@hd-web/jsx'

type StringifyResult = {
  nodes?: FlatHdNode[]
  html?: string
}

type Flattened<T> = T extends Array<unknown> ? never : T

export type FlatHdNode = Flattened<HdNode>

export type ComponentInfo = {
  filename: string
  key: string
}

export type StringifyFunction<T extends FlatHdNode = FlatHdNode> = (
  node: T,
  /** Component key => filename */
  components: Map<string, string>
) => StringifyResult

export type StringifyNodeOutput = {
  /** Information about each instance encountered of a component. */
  components: ComponentInfo[]
  /** The stringified html */
  html: string
}

export type ComponentListener = [event: string, method: string]
