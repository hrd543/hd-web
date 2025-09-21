import type {
  Html,
  HdElement,
  HdNode,
  IBehaviourConstructor
} from '@hd-web/jsx'

type InferProps<C> = C extends IBehaviourConstructor<any, infer P> ? P : never

export type InteractiveProps<
  T extends keyof HTMLElementTagNameMap,
  B extends IBehaviourConstructor<T, any>
> = Html.HTMLElements[T] & {
  _use: B
  _as: T
  children?: HdNode
} & (InferProps<B> extends Record<string, never>
    ? { _with?: undefined }
    : { _with: InferProps<B> })

export const Interactive = <
  T extends keyof HTMLElementTagNameMap,
  B extends IBehaviourConstructor<T, any>
>({
  _as,
  _use,
  _with,
  children,
  ...props
}: InteractiveProps<T, B>): HdElement => ({
  tag: _as,
  props: {
    ...props,
    'data-hd-id': _use.key
  },
  children,
  interactive: {
    behaviour: _use,
    props: _with
  }
})
