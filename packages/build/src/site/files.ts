import path from 'path'
import * as url from 'url'
import { Dirent } from 'fs'
import { pageFile } from './constants.js'

/** Get the file url for the filepath so that it may be import()ed */
export const getImportPath = (filepath: string) =>
  url.pathToFileURL(filepath).href

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

/** Replace all \ with / if importing on Windows */
export const formatPathForImport = (p: string) =>
  p.replaceAll(path.sep, path.posix.sep)
