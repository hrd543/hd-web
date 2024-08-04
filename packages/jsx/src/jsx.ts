export type Primitive = string | number | boolean | null | undefined
export type Element = string | null
export type Children = Element | Element[] | undefined
export interface IntrinsicElements extends IntrinsicElementMap {}

type HtmlProps<K extends keyof HTMLElementTagNameMap> = Partial<
  PickMatching<Omit<HTMLElementTagNameMap[K], 'children'>, Primitive> & {
    children: Children
  }
>

type SvgProps<K extends keyof SVGElementTagNameMap> = Partial<
  PickMatching<Omit<SVGElementTagNameMap[K], 'children'>, Primitive> & {
    children: Children
  }
>

type IntrinsicElementMap = {
  [K in keyof HTMLElementTagNameMap]: HtmlProps<K>
} & {
  [K in keyof SVGElementTagNameMap]: SvgProps<K>
}

export interface ElementChildrenAttribute {
  children: {}
}

export type Props<T extends BaseProps = BaseProps> = T & {
  children?: Children
}

export type Component<T extends BaseProps = BaseProps> = (
  props: Props<T>
) => Element

type BaseProps = Record<string, unknown>

type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]

type PickMatching<T, V> = Pick<T, KeysMatching<T, V>>
