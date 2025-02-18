export type ImageProps = {
  src: string
  srcMobile?: string
  alt: string
  /** The ratio of width / height */
  ratio: number
  /** Should the width or height determing the size. Defaults to w */
  dim?: 'w' | 'h' | null
  lazy?: boolean
  clazz?: string
}
