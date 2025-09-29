export type ImageModifications = {
  /**
   * Integer describing how much to optimise the image
   *
   * (low quality) 0 <= quality <= 100 (high quality)
   */
  quality: number
}

export type CopiedImageInfo = {
  /** The src of the original image */
  src: string
  /** Has the image been edited in any way? */
  modifications?: ImageModifications
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
  /** This is the original location on the fs of the image */
  comesFrom: string
}

// Need to use global variables as the code gets bundled so may not
// necessarily reference the same local variables
declare global {
  /**
   * A map of images to be copied over after the build.
   *
   * Will be undefined in dev mode
   */
  var _hdImages: Map<string, CopiedImageInfo[]> | undefined
}
