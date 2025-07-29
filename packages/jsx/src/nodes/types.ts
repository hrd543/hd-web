import { BaseProps, Child, IComponent } from '../types.js'

type StringifyResult = {
  entries?: RenderStackEntry[]
  html?: string
}

export type RenderStackEntry<
  T extends Child = Child,
  P extends BaseProps = BaseProps
> = [element: T, component: IComponent<P> | null, props?: P | null]

export type StringifyFunction<T extends Child = Child> = (
  entry: RenderStackEntry<T>,
  components: Map<string, string>
) => StringifyResult

export type RenderToStringOutput = {
  /**
   * Information about each instance encountered of a component.
   *
   * Keyed by its id
   */
  components: Map<string, string>
  /**
   * The html to be rendered in the body
   */
  html: string
}
