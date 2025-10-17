import { getFileProcessor } from '../processing/getFileProcessor.js'
import { FileModificatons, FileType } from '../processing/types.js'
import { getFileType } from './getFileType.js'
import { hashBuffer } from './hashBuffer.js'
import fs from 'fs/promises'
import path from 'path'

const getValidatedFile = (src: string) => {
  // We can't support relative paths (yet)
  if (src.startsWith('.')) {
    throw new Error(
      `Couldn't register file ${src}. Don't currently support relative imports for files`
    )
  }

  if (src.startsWith('/')) {
    return path.join(process.cwd(), src)
  }

  return src
}

export const registerFile = async <T extends FileType>(
  srcRaw: string,
  modificationsRaw: FileModificatons<T> | undefined,
  // Useful if work has already been done on the file to avoid re-reading
  fileBuffer?: Buffer
) => {
  const src = getValidatedFile(srcRaw)
  // This means we're in dev mode
  if (!globalThis._hdFiles2) {
    return src
  }

  const { ext, name } = path.parse(src)
  const fileType = getFileType(ext) as T
  const processor = getFileProcessor(fileType)

  const files = globalThis._hdFiles2[fileType]
  const existingFilesMap = files?.get(src)

  const modifications = processor.sanitise(modificationsRaw)
  const modificationsHash = processor.stringifyModifications(modifications)
  const existingFilename = existingFilesMap?.get(modificationsHash)

  // We don't need to copy the file if it's already been done
  if (existingFilename) {
    return existingFilename
  }

  // and process the file
  const fileContents = fileBuffer ?? (await fs.readFile(src))
  const hash = hashBuffer(fileContents)
  const newFileType = processor.getFileType?.(modifications) ?? ext
  const filename = `/files/${name}-${hash}-${modificationsHash}${newFileType}`
  await processor.process(
    fileContents,
    path.posix.join(globalThis._hdFilesOutFolder, filename),
    modifications
  )

  // Now register that it has been done
  if (existingFilesMap) {
    existingFilesMap.set(modificationsHash, filename)
  } else {
    files.set(src, new Map([[modificationsHash, filename]]))
  }

  return filename
}

export const initialiseFiles = (out: string) => {
  globalThis._hdFiles2 = {
    image: new Map(),
    other: new Map()
  }
  globalThis._hdFilesOutFolder = out
}

export const resetFiles = () => {
  globalThis._hdFiles2 = undefined
  // This shouldn't end up being used, so typing like this
  // so that errors are thrown
  globalThis._hdFilesOutFolder = null as unknown as string
}

declare global {
  var _hdFiles2: Record<FileType, Map<string, Map<string, string>>> | undefined
  var _hdFilesOutFolder: string
}
