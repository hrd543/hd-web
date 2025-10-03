import { HdImage } from '../shared/index.js'

export type ImageProps = {
  // only `comesFrom` is used, but using this type so it's less confusing
  // to users.
  src: HdImage
  alt: string
  /** The intended ratio of width / height */
  ratio?: number
  /** Should the width or height determine the size. Defaults to w */
  dim?: 'w' | 'h' | null
  quality: number
  lazy?: boolean
  className?: string
}
