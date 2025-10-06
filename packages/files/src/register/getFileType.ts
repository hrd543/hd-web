import path from 'path'

import { HdFileType } from './types.js'

const images = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif'])

export const getFileType = (filepath: string): HdFileType => {
  const { ext } = path.parse(filepath)

  if (images.has(ext)) {
    return 'image'
  }

  return 'other'
}
