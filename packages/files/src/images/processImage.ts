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

  const { size, quality } = modifications
  let copied = await sharp(src)

  if (size) {
    copied = copied.resize({
      width: size[0],
      height: size[1],
      fit: 'cover',
      position: sharp.strategy.attention
    })
  }

  if (quality !== undefined) {
    copied = copied.webp({
      quality,
      lossless: false
    })
  }

  await copied.toFile(outputFile)
}
