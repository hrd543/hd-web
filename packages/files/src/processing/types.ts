import { ImageModifications } from './images/imageModifications.js'

export type OtherModifications = never

type FileModificationsByType = {
  image: ImageModifications
  other: OtherModifications
}

export type FileType = keyof FileModificationsByType

export type FileModificatons<T extends FileType> = FileModificationsByType[T]
