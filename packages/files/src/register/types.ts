import {
  ImageModifications,
  OtherModifications
} from '../shared/modifications.js'
import { HdFileInfo } from '../shared/types.js'

export type HdFileInfoByType = {
  image: ImageModifications
  other: OtherModifications
}

export type HdFileType = keyof HdFileInfoByType

// Need to use global variables as the code gets bundled so may not
// necessarily reference the same local variables
declare global {
  /**
   * A map of files to be copied over after the build.
   *
   * Will be undefined in dev mode
   */
  var _hdFiles:
    | {
        [T in HdFileType]?: Map<string, Array<HdFileInfo<HdFileInfoByType[T]>>>
      }
    | undefined
}
