import path from 'path'
import { Dirent } from 'fs'
import { pageFile } from './constants.js'

/**
 * Given a list of dirents, find all folders which contain a page file,
 * relative to baseDir.
 * E.g. if baseDir = "src"
 * src
 *   about
 *     index.js
 *   contact
 *     hello.js
 *   index.js
 *
 * would return "" and "about"
 */
export const getActivePages = (entries: Dirent[], baseDir: string) => {
  return Array.from(
    new Set(
      entries
        .filter((p) => p.isFile() && p.name === pageFile)
        .map((dirent) => path.relative(baseDir, dirent.parentPath))
    )
  )
}
