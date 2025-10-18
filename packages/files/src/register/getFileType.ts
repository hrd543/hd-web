import { FileType } from '../processing/types.js'

const images = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])

export const getFileType = (ext: string): FileType => {
  if (images.has(ext)) {
    return 'image'
  }

  return 'other'
}
