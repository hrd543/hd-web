import { HdImage } from '../shared/index.js'

export type ImageProps = {
  src: HdImage
  alt: string
  /** The intended ratio of width / height */
  ratio?: number
  /** Should the width or height determine the size. Defaults to w */
  dim?: 'w' | 'h' | null
  compression: number
  lazy?: boolean
  className?: string
}
