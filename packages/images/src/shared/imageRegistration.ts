import { CompressedImageInfo } from './types.js'

export const resetImages = () => {
  globalThis._hdImages = {
    original: new Set(),
    compressed: new Map()
  }
}

const areCompressedImagesEqual = (
  a: CompressedImageInfo,
  b: CompressedImageInfo
) => {
  // Can ignore src since it's assumed that'll be the same
  return a.compression === b.compression
}

// We only want to store references to images which will actually need to be created.
// If I reference the same image twice with identical options, only need one copy.
const shouldAddCompressedImage = (
  existing: CompressedImageInfo[],
  toAdd: CompressedImageInfo
) => {
  return !existing.some((image) => areCompressedImagesEqual(image, toAdd))
}

export const registerCompressedImage = (image: CompressedImageInfo) => {
  const compressed = globalThis._hdImages.compressed
  const existing = compressed.get(image.src)

  if (existing) {
    if (shouldAddCompressedImage(existing, image)) {
      existing.push(image)
    }
  } else {
    compressed.set(image.src, [image])
  }
}

export const getImages = () => ({
  compressed: globalThis._hdImages.compressed.values().toArray().flat(),
  original: Array.from(globalThis._hdImages.original)
})
