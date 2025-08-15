import { BaseProps, Child, FuncComponent } from '../types.js'

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

export type RenderToStringOutput = {
  /**
   * Information about each instance encountered of a component.
   *
   * Keyed by its id
   */
  components: ComponentInfo[]
  /**
   * The html to be rendered in the body
   */
  html: string
}
