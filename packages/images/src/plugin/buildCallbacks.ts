import fs from 'fs/promises'
import path from 'path'

import {
  getCopiedImgSrc,
  getImages,
  initialiseImages,
  resetImages
} from '../shared/index.js'
import { processImage } from '../processing/processImage.js'

// We only want to copy images over when writing for now.
export const onBuildStart = (write: boolean | undefined) => {
  if (write) {
    initialiseImages()
  }
}

/**
 * On build end, process and copy over the images, then reset
 */
export const onBuildEnd = async (
  out: string,
  write: boolean | undefined
): Promise<void> => {
  if (!write) {
    return
  }

  const images = getImages()

  if (images.length > 0) {
    await fs.mkdir(path.join(out, 'images'))

    for (const image of images) {
      const newSrc = getCopiedImgSrc(image)

      await processImage(image, path.posix.join(out, newSrc))
    }
  }

  resetImages()
}
