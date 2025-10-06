import path from 'path'
import type { HdFileInfo } from '../shared/types.js'
import { isDevMode } from '../register/fileRegistration.js'
import { HdFileInfoByType, HdFileType } from './types.js'
const staticFolder = 'files'

export const getCopiedSrc = <T extends HdFileType>(
  file: HdFileInfo<HdFileInfoByType[T]>,
  getFilename?: (
    name: string,
    ext: string,
    modifications?: HdFileInfoByType[T]
  ) => string
) => {
  if (isDevMode()) {
    return getDevFilepath(file.src)
  }

  const { name, ext } = path.parse(file.src)

  const filename =
    getFilename?.(name, ext, file.modifications) ?? `${name}${ext}`

  return `/${staticFolder}/${filename}`
}

// Dev requires filepaths relative to the root rather than absolute
const getDevFilepath = (absolutePath: string) => {
  const relativePath = path.relative(process.cwd(), absolutePath)
  return '/' + relativePath.replaceAll('\\', '/')
}
