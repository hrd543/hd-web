import * as fs from 'fs/promises'
import * as path from 'path'
import { getActivePages } from './getActivePages.js'
import { defaultConfig, pageFile, tempBuildFile } from './constants.js'
import * as esbuild from 'esbuild'
import { formatPathForImport } from '../getFilePath.js'

// Variables must start with a non-number
const encodeExport = (index: number) => `a${index}`

/**
 * Given an array of file paths, build a string containing
 * export statements for each path, assuming a default export.
 * Objects are exported as a{index}
 */
// baseDir = "src", files = "about", "", "contact"
export const buildExports = (files: string[]) => {
  if (files.length === 0) {
    return ''
  }

  const imports = files.reduce((content, file, i) => {
    const importPath = formatPathForImport(path.join(file, pageFile))

    return `${content}import {default as ${encodeExport(i)}} from "./${importPath}";\n`
  }, '')

  return `
    ${imports}
    const pages = [${files.map((f, i) => encodeExport(i)).join(',')}];
    export default pages;  
  `
}

export const buildJs = async (entryDir: string, outFile: string) => {
  const tempBuildFileLocation = path.join(entryDir, tempBuildFile)

  try {
    // Get a list of all files and folders contained in entryDir.
    // If src, this gives me all paths including src at the root.
    // e.g. entryDir/...
    const entryDirContent = await fs.readdir(entryDir, {
      recursive: true,
      withFileTypes: true
    })

    // This returns the parentPath for every index file.
    // i.e. src, src/about, src/contact
    const activePages = getActivePages(entryDirContent, entryDir)
    // This contains all the imports in entryDir as absoulte paths
    const entryContent = buildExports(activePages)
    await fs.writeFile(tempBuildFileLocation, entryContent)

    // First bundle all the js into one file
    await esbuild.build({
      ...defaultConfig,
      entryPoints: [tempBuildFileLocation],
      outfile: outFile,
      // don't minify on the first pass to save time
      minify: false,
      // Use esm to preserve imports
      format: 'esm'
    })

    return activePages
  } finally {
    // Now delete the file since it's no longer needed.
    await fs.unlink(tempBuildFileLocation)
  }
}
