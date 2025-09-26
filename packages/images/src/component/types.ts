export type ImageProps = {
  src: HdImage
  alt: string
  /** The intended ratio of width / height */
  ratio?: number
  /** Should the width or height determine the size. Defaults to w */
  dim?: 'w' | 'h' | null
  lazy?: boolean
  className?: string
}

export type HdImage = {
  /** Get the src of the image and copy it over to the build folder */
  src: string
  /**
   * Get the src of the image without copying it over.
   *
   * Prefer using the `Image` component or accessing `src` where possible
   */
  srcRaw: string
}
