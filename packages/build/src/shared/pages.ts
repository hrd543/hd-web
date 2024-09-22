import path from 'path'
import { Dirent } from 'fs'
import fs from 'fs/promises'

const getActivePagesFromDirents = (
  entries: Dirent[],
  baseDir: string,
  pageFilename: string
) => {
  return (
    entries
      .filter((p) => p.isFile() && p.name === pageFilename)
      // Replace path with parentPath once memfs has it
      .map((dirent) => path.relative(baseDir, dirent.path))
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

export const createPageDirectories = async (
  mkdir: (
    path: string,
    options: { recursive: boolean }
  ) => Promise<string | void>,
  dir: string,
  pages: string[]
) => {
  await Promise.all(
    pages.map((p) => mkdir(path.join(dir, p), { recursive: true }))
  )
}

export const createPages = async (
  dir: string,
  pages: string[],
  contents: string[]
) => {
  await Promise.all(
    pages.map((p, i) =>
      fs.writeFile(path.join(dir, p, 'index.html'), contents[i]!)
    )
  )
}

/**
 * Take the default export from the built js, which is expected to be
 * an array of functions, and run those functions to return a list
 * of html contents as strings.
 *
 * Throws an error if pageBuilders isn't an array of functions returning
 * strings
 */
export const validatePages = async (pageBuilders: unknown, pages: string[]) => {
  if (!Array.isArray(pageBuilders) || pageBuilders.length === 0) {
    throw new Error(
      "Pages wasn't an array - did you forget to add any index files?"
    )
  }

  return pageBuilders.map((builder, i) => {
    if (typeof builder !== 'function') {
      throw new Error(`Default export at ${pages[i]!} isn't a function`)
    }

    const content = builder()

    if (typeof content !== 'string') {
      throw new Error(`Default export at ${pages[i]!} doesn't return a string`)
    }

    return content
  })
}
