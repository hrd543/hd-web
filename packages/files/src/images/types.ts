import { HdFile } from '../shared/types.js'

export type ImageProps = {
  src: HdFile
  alt: string
  /** The intended ratio of width / height */
  ratio?: number
  /** Should the width or height determine the size. Defaults to w */
  dim?: 'w' | 'h' | null
  quality: number
  lazy?: boolean
  className?: string
}
