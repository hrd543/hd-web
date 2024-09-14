import * as fs from 'fs/promises'
import * as path from 'path'
import { tempBuildFile } from './constants.js'
import { formatPathForImport } from '../getFilePath.js'

// Variables must start with a non-number
const encodeExport = (index: number) => `a${index}`

/**
 * Given an array of file paths, build a string containing
 * export statements for each path, assuming a default export.
 * Objects are exported as a{index}
 */
export const buildExportContent = (files: string[]) => {
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

export const createEntryFile = async (
  dir: string,
  pages: string[],
  pageFilename: string
) => {
  const entry = path.join(dir, tempBuildFile)
  const entryContent = buildExportContent(
    pages.map((page) => path.join(page, pageFilename))
  )
  await fs.writeFile(entry, entryContent)

  return entry
}

/**
 * Create definitions for every custom element used
 */
export const defineCustomElements = (
  getCustomElements: () => Record<string, string>
) => {
  const customEls = getCustomElements()
  let customElsDefinition = ''

  for (const element in customEls) {
    customElsDefinition += `customElements.define("${element}", ${customEls[element]});`
  }

  return customElsDefinition
}
