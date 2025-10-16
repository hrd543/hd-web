import { ImageModifications } from './imageModifications.js'

const sanitiseQuality = (quality?: number) => {
  if (quality === undefined) {
    return
  }

  const floored = Math.floor(quality)

  if (floored < 0) {
    return 0
  }

  if (floored > 100) {
    return 100
  }

  return floored
}

const sanitiseDimension = (dim?: number) => {
  if (dim === undefined) {
    return
  }

  if (dim < 0) {
    return
  }

  return Math.floor(dim)
}

const sanitiseSize = (
  size: ImageModifications['size']
): ImageModifications['size'] => {
  if (!size) {
    return
  }

  return [sanitiseDimension(size[0]), sanitiseDimension(size[1])]
}

export const sanitiseImageModifications = (
  modifications?: ImageModifications
): ImageModifications | undefined => {
  if (!modifications) {
    return
  }

  return {
    quality: sanitiseQuality(modifications.quality),
    size: sanitiseSize(modifications.size)
  }
}
