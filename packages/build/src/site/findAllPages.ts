import { Dirent } from 'fs'
import { default as hello } from 'fs/promises'
import * as path from 'path'
import { getFilePath } from '../getFilePath.js'

const indexFile = 'index.tsx'

// const allPaths = await fs.readdir(dir, {
//   recursive: true,
//   withFileTypes: true
// })

// Variables must start with a non-number
const encodeExport = (index: number) => `a${index}`
const decodeExport = (exp: string) => Number(exp.slice(1))

/**
 * Given an array of paths, return a unique list of
 * paths which contain an index.tsx file
 */
export const findAllPages = (paths: Dirent[]) => {
  return Array.from(
    new Set(
      paths
        .filter((p) => p.isFile() && p.name === indexFile)
        .map((dirent) => dirent.parentPath)
    )
  )
}

/**
 * Given an array of file paths, build a string containing
 * export statements for each path, assuming a default export.
 * Objects are exported as a{index}
 */
export const buildExports = (baseDir: string, files: string[]) => {
  if (files.length === 0) {
    return ''
  }

  const imports = files.reduce((content, file, i) => {
    const importPath = path.relative(baseDir, file)

    return `${content}import {default as ${encodeExport(i)}} from "./${importPath}";\n`
  }, '')

  return `
    ${imports}
    const pages = [${files.map((f, i) => encodeExport(i)).join(',')}];
    export default pages;  
  `
}

console.log(import.meta.url)

/*

First go through the directory and find all index files.
Then create an index file containing all of the exports.
Name these as "a1" for the first entry, "a2" for the second etc
Build the js using this as the entry point.
Then import this file, run each of the functions within it and
create the html file at the same file path but inside dist.

*/
