import { registerFile } from '../register/fileRegistration.js'
import { HdFile } from '../shared/types.js'
import { getCopiedSrc } from '../register/getCopiedSrc.js'

/**
 * We want loading a file to return an object which can access both the
 * new src attribute, as well as the original location.
 *
 * If accessing `src`, we want to register the file to be copied.
 */
export const buildFileExport = (src: string): HdFile => {
  // Don't need the second argument as it will always be the raw file
  // (for now)
  const newSrc = getCopiedSrc({ src })

  return {
    get src() {
      registerFile({ src: newSrc })

      return newSrc
    },
    comesFrom: src
  }
}
