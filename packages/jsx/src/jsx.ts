export declare namespace JSX {
  type Primitive = string | number | boolean | null | undefined
  type Element = globalThis.Element | Primitive
  interface IntrinsicElements extends IntrinsicElementMap {}

  type HtmlProps<K extends keyof HTMLElementTagNameMap> = Partial<
    PickMatching<Omit<HTMLElementTagNameMap[K], 'children'>, Primitive> & {
      children: Element
    }
  >

  type SvgProps<K extends keyof SVGElementTagNameMap> = Partial<
    PickMatching<Omit<SVGElementTagNameMap[K], 'children'>, Primitive> & {
      children: Element
    }
  >

  type IntrinsicElementMap = {
    [K in keyof HTMLElementTagNameMap]: HtmlProps<K>
  } & {
    [K in keyof SVGElementTagNameMap]: SvgProps<K>
  }

  interface ElementChildrenAttribute {
    children: {}
  }
}

type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

type PickMatching<T, V> = Pick<T, KeysMatching<T, V>>
