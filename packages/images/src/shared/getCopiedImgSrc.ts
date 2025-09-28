import path from 'path'
import { CopiedImageInfo } from './types.js'

const imgFolder = 'images'

export const getCopiedImgSrc = (image: CopiedImageInfo) => {
  const filename = getImgFilename(image)

  return `/${imgFolder}/${filename}`
}

const getImgFilename = (image: CopiedImageInfo) => {
  const { name, ext } = path.parse(image.src)

  if (!image.modifications) {
    return `${name}${ext}`
  }
  // TODO add some hashing here

  return `${name}-${image.modifications.quality}.webp`
}
