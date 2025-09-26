export type HdImageRecord = {
  src: string
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

// Need to use global variables as the code gets bundled so may not
// necessarily reference the same local variables
declare global {
  var _hdImages: HdImageRecord[]
}
