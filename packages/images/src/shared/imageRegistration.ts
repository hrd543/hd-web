import path from 'path'
import { getCopiedImgSrc } from './getCopiedImgSrc.js'
import { CopiedImageInfo, ImageModifications } from './types.js'

export const initialiseImages = () => {
  globalThis._hdImages = new Map()
}

export const resetImages = () => {
  globalThis._hdImages = undefined
}

const areModificationsEqual = (
  a: ImageModifications,
  b: ImageModifications
) => {
  return a.quality === b.quality
}

// We only want to store references to images which will actually need to be created.
// If I reference the same image twice with identical options, only need one copy.
const shouldRegisterImage = (
  existing: CopiedImageInfo[],
  toAdd: CopiedImageInfo
) => {
  return !existing.some((image) => {
    if (toAdd.modifications && image.modifications) {
      return areModificationsEqual(toAdd.modifications, image.modifications)
    }

    return !toAdd.modifications && !image.modifications
  })
}

/**
 * Register an image to be copied over.
 *
 * Returns the src which should be used when referencing the image
 */
export const registerImage = (image: CopiedImageInfo) => {
  const images = globalThis._hdImages
  const existing = images?.get(image.src)

  if (existing) {
    if (shouldRegisterImage(existing, image)) {
      existing.push(image)
    }
  } else {
    images?.set(image.src, [image])
  }

  return getCopiedImgSrc(image, images === undefined)
}

export const getImages = () =>
  globalThis._hdImages?.values().toArray().flat() ?? []
