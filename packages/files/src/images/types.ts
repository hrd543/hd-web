import { HdFile } from '../shared/types.js'

export type ImageProps = {
  src: Pick<HdFile, 'comesFrom'>
  alt: string
  width: number
  height: number
  resize?: boolean
  /** Should the width or height determine the size. Defaults to w */
  dim?: 'w' | 'h' | null
  /** Number between 0 and 100 for the image quality */
  quality?: number
  lazy?: boolean
  className?: string
}
