import { HdFile } from '../shared/types.js'

export type ImageProps = {
  src: Pick<HdFile, 'comesFrom'>
  alt: string
  width?: number
  height?: number
  resize?: boolean
  // TODO remove this option as it's not really relevant.
  // Once the html types are better, allow for adding style to the img
  // and then expose the function for getting that style
  /** Should the width or height determine the size. Defaults to w */
  dim?: 'w' | 'h' | null
  /** Number between 0 and 100 for the image quality */
  quality?: number
  lazy?: boolean
  className?: string
}
