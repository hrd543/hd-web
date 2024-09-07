import path from 'path'
import { Dirent } from 'fs'
import * as fs from 'fs/promises'

const getActivePagesFromDirents = (
  entries: Dirent[],
  baseDir: string,
  pageFilename: string
) => {
  return Array.from(
    new Set(
      entries
        .filter((p) => p.isFile() && p.name === pageFilename)
        .map((dirent) => path.relative(baseDir, dirent.parentPath))
    )
  )
}

/**
 * Search all folders inside entryDir and return all index files,
 * relative to baseDir.
 *
 * E.g. if baseDir = "src"
 * ```
 * src
 *   about
 *     index.js
 *   contact
 *     hello.js
 *   index.js
 * ```
 * would return "" and "about"
 */
export const getActivePages = async (
  entryDir: string,
  pageFilename: string
) => {
  const entryDirContent = await fs.readdir(entryDir, {
    recursive: true,
    withFileTypes: true
  })

  return getActivePagesFromDirents(entryDirContent, entryDir, pageFilename)
}
