import * as fs from 'fs/promises'
import * as path from 'path'
import { defaultConfig, tempBuildFile } from './constants.js'
import * as esbuild from 'esbuild'
import { formatPathForImport, getImportPath } from '../getFilePath.js'

// Variables must start with a non-number
const encodeExport = (index: number) => `a${index}`

/**
 * Given an array of file paths, build a string containing
 * export statements for each path, assuming a default export.
 * Objects are exported as a{index}
 */
export const buildExports = (files: string[]) => {
  if (files.length === 0) {
    return ''
  }

  const imports = files.reduce((content, file, i) => {
    const importPath = formatPathForImport(file)

    return `${content}import {default as ${encodeExport(i)}} from "./${importPath}";\n`
  }, '')

  return `
    ${imports}
    const pages = [${files.map((f, i) => encodeExport(i)).join(',')}];
    export default pages;  
  `
}

/**
 * Create a js file at out containing all code within activePages, relative
 * to the file at entry and default exporting each page's default export
 * as an array.
 *
 * Return the
 *
 * (Assumes activePages are already relative to entry)
 */
export const getPageBuilders = async (
  entryDir: string,
  out: string,
  activePages: string[],
  pageFilename: string
) => {
  const entry = path.join(entryDir, tempBuildFile)
  try {
    // Create a new temp file to store all the page exports
    const entryContent = buildExports(
      activePages.map((page) => path.join(page, pageFilename))
    )
    await fs.writeFile(entry, entryContent)

    // Bundle all the js together. This needs to be done so that the
    // custom element names line up in the bundled code
    await esbuild.build({
      ...defaultConfig,
      entryPoints: [entry],
      outfile: out,
      // don't minify on the first pass to save time
      minify: false,
      // Use esm to preserve imports
      format: 'esm'
    })

    // Now import it and return the default export.
    return (await import(getImportPath(out))).default
  } finally {
    // Now delete the file since it's no longer needed.
    await fs.unlink(entry)
  }
}
