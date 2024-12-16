import fs from 'fs/promises'
import { removeExports } from './removeExports.js'
import { defineInteractions } from '../shared/interactivity.js'

/**
 * Remove any exports from file, and append any custom element definitions
 * found in getCustomElements.
 */
export const processJs = async (file: string) => {
  const outFileHandle = await fs.open(file, 'r+')
  try {
    await removeExports(outFileHandle)
    outFileHandle.write(defineInteractions(), (await outFileHandle.stat()).size)
  } finally {
    await outFileHandle.close()
  }
}
