import path from 'path'
import type { FileNameFunction, HdFileInfo } from '../shared/types.js'
import { isDevMode } from '../register/fileRegistration.js'
import { HdFileInfoByType, HdFileType } from './types.js'
import { createHash } from './hashing.js'
const staticFolder = 'files'

export const getCopiedSrc = <T extends HdFileType>(
  file: HdFileInfo<HdFileInfoByType[T]>,
  getFilename?: FileNameFunction<
    NonNullable<HdFileInfo<HdFileInfoByType[T]>['modifications']>
  >
) => {
  if (isDevMode()) {
    return getDevFilepath(file.src)
  }

  const parsed = path.parse(file.src)
  const { name, ext } = getFilename?.(parsed, file.modifications) ?? parsed

  return `/${staticFolder}/${name}-${createHash(parsed.dir)}.${ext}`
}

// Dev requires filepaths relative to the root rather than absolute
const getDevFilepath = (absolutePath: string) => {
  const relativePath = path.relative(process.cwd(), absolutePath)
  return '/' + relativePath.replaceAll('\\', '/')
}
