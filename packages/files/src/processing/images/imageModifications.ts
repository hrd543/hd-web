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

export const stringifyImageModifications = (
  modifications?: ImageModifications
): string => {
  if (!modifications) {
    return 'original'
  }

  const strings: string[] = []

  if (modifications.quality) {
    strings.push(`q${modifications.quality}`)
  }

  if (modifications.size) {
    const [w, h] = modifications.size
    if (w !== undefined) {
      strings.push(`w${w}`)
    }

    if (h !== undefined) {
      strings.push(`h${h}`)
    }
  }

  return strings.join('')
}
