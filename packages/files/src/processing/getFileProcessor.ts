import { FileProcessor } from './fileProcessor.js'
import { imageProcessor } from './images/index.js'
import { otherProcessor } from './other/index.js'
import { FileModificatons, FileType } from './types.js'

const processors: {
  [T in FileType]: FileProcessor<FileModificatons<T>>
} = {
  image: imageProcessor,
  other: otherProcessor
}

export const getFileProcessor = <T extends FileType>(
  type: T
): FileProcessor<FileModificatons<T>> => processors[type]
