import { BuildEndResult, HdConfig } from 'hd-web'
import fs from 'fs/promises'
import path from 'path'

import { getCopiedImgSrc, getImages, resetImages } from '../shared/index.js'
import { processImage } from '../processing/processImage.js'

export const onBuildStart = resetImages

/**
 * On build end, process and copy over the images, then reset
 */
export const onBuildEnd = async ({
  out,
  write
}: HdConfig): Promise<BuildEndResult> => {
  const images = getImages()
  const copied: string[] = []

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

  resetImages()

  return {
    files: copied.map((f) => ({ relativePath: f }))
  }
}
