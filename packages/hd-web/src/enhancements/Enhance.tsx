import type {
  Html,
  HdElement,
  HdNode,
  IBehaviourConstructor
} from '@hd-web/jsx'

type InferProps<C> = C extends IBehaviourConstructor<any, infer P> ? P : never
type OptionalUsing<T> =
  T extends Record<string, never>
    ? { using?: undefined }
    : {
        /** The props to be passed into the behaviour */
        using: T
      }

export type EnhanceViewProps<
  T extends keyof HTMLElementTagNameMap,
  B extends IBehaviourConstructor<T, any>
> = Html.HTMLElements[T] & {
  /** The behaviour to be attached to this DOM element */
  with: B
  children?: HdNode
} & OptionalUsing<InferProps<B>>

/**
 * Allows you to enhance intrinsic html elements.
 *
 * Reference the element tag on this object to use it as if it were a normal
 * tag, with two new props for assigning client behaviour and props.
 *
 * Example usage
 * ```ts
 * <Enhance.button with={ButtonBehaviour} using={buttonProps} type="button" />
 */
export const Enhance = new Proxy({} as EnhanceViews, {
  // "div" should actually be keyof HtmlElementTagNameMap
  // but TS becomes so slow if I do that and it doesn't affect anything
  get(target, tag: string) {
    return ({
      using,
      with: _with,
      children,
      ...props
    }: EnhanceViewProps<'div', any>): HdElement => ({
      tag,
      props: {
        ...props,
        'data-hd-id': _with.key
      },
      children,
      enhancements: {
        behaviour: _with,
        props: using
      }
    })
  }
})

type EnhanceViews = {
  [K in keyof HTMLElementTagNameMap]: {
    <B extends IBehaviourConstructor<K, any>>(
      props: EnhanceViewProps<K, B>
    ): HdElement
  }
}
