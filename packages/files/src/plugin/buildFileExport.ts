import { HdFile } from '../shared/types.js'
import { registerFile } from '../register/registerFile.js'

/**
 * We want loading a file to return an object which can access both the
 * new src attribute, as well as the original location.
 *
 * If accessing `src`, we want to register the file to be copied.
 */
export const buildFileExport = (src: string): HdFile => {
  return {
    src() {
      return registerFile(src)
    },
    comesFrom: src
  }
}
