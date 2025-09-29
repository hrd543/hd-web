import path from 'path'
import { CopiedImageInfo } from './types.js'

const imgFolder = 'images'

export const getCopiedImgSrc = (image: CopiedImageInfo, dev = false) => {
  if (dev) {
    return getDevFilepath(image.src)
  }

  const filename = getImgFilename(image)

  return `/${imgFolder}/${filename}`
}

// Dev requires filepaths relative to the root rather than absolute
const getDevFilepath = (absolutePath: string) => {
  const relativePath = path.relative(process.cwd(), absolutePath)
  return '/' + relativePath.split(path.sep).join('/')
}

const getImgFilename = (image: CopiedImageInfo) => {
  const { name, ext } = path.parse(image.src)

  if (!image.modifications) {
    return `${name}${ext}`
  }
  // TODO add some hashing here

  return `${name}-${image.modifications.quality}.webp`
}
