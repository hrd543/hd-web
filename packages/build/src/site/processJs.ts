import fs from 'fs/promises'
import { defineCustomElements } from '../shared/js.js'
import { removeExports } from './removeExports.js'

/**
 * Remove any exports from file, and append any custom element definitions
 * found in getCustomElements.
 */
export const processJs = async (
  file: string,
  getCustomElements: () => Record<string, string>
) => {
  const outFileHandle = await fs.open(file, 'r+')
  try {
    await removeExports(outFileHandle)
    outFileHandle.write(
      defineCustomElements(getCustomElements),
      (await outFileHandle.stat()).size
    )
  } finally {
    await outFileHandle.close()
  }
}
