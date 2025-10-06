import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

import { HdFileInfo } from '../shared/types.js'
import { ImageModifications } from '../shared/modifications.js'
import { getCopiedSrc } from '../register/getCopiedSrc.js'
import { getCopiedImgFilename } from './getCopiedImgFilename.js'

export const processImage = async (
  image: HdFileInfo<ImageModifications>,
  outputFolder: string
) => {
  const newSrc = getCopiedSrc(image, getCopiedImgFilename)
  const outputFile = path.posix.join(outputFolder, newSrc)

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
