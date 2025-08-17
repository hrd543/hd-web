import { BaseProps, Child, FuncComponent } from '../jsx/index.js'

type StringifyResult = {
  entries?: RenderStackEntry[]
  html?: string
}

export type RenderStackEntry<
  T extends Child = Child,
  P extends BaseProps = BaseProps
> = [element: T, component: FuncComponent<P> | null, props?: P | null]

export type ComponentInfo = {
  filename: string
  key: string
}

export type StringifyFunction<T extends Child = Child> = (
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
