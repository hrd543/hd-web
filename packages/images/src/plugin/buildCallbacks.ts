import { BuildEndResult, HdConfig } from 'hd-web'
import fs from 'fs/promises'
import path from 'path'

import {
  getCopiedImgSrc,
  getImages,
  initialiseImages,
  resetImages
} from '../shared/index.js'
import { processImage } from '../processing/processImage.js'

// We only want to copy images over in build for now.
export const onBuildStart = (config: unknown, type: 'build' | 'dev') => {
  if (type === 'build') {
    initialiseImages()
  }
}

/**
 * On build end, process and copy over the images, then reset
 */
export const onBuildEnd = async ({
  out,
  write
}: HdConfig): Promise<BuildEndResult> => {
  const images = getImages()
  const copied: string[] = []

  if (images.length > 0) {
    if (write) {
      await fs.mkdir(path.join(out, 'images'))
    }

    for (const image of images) {
      const newSrc = getCopiedImgSrc(image)

      copied.push(newSrc)

      if (write) {
        await processImage(image, path.posix.join(out, newSrc))
      }
    }
  }

  resetImages()

  return {
    files: copied.map((f) => ({ relativePath: f }))
  }
}
