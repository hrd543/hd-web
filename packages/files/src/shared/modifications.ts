// Need this to be in a separate folder to avoid
// circ. dependencies
export type ImageModifications = {
  /**
   * Integer describing how much to optimise the image
   *
   * (low quality) 0 <= quality <= 100 (high quality)
   */
  quality?: number
  /** The desired width and height of the image */
  size?: [w: number | undefined, h: number | undefined]
}

export type OtherModifications = never
