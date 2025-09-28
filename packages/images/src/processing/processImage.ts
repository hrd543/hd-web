import sharp from 'sharp'
import fs from 'fs/promises'

import { CopiedImageInfo } from '../shared/index.js'

export const processImage = async (
  image: CopiedImageInfo,
  outputFile: string
) => {
  const { src, modifications } = image

  if (!modifications) {
    return await fs.copyFile(src, outputFile)
  }

  await sharp(src)
    .webp({
      quality: modifications.quality,
      lossless: false
    })
    .toFile(outputFile)
}
