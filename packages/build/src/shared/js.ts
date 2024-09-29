import * as path from 'path'

// Variables must start with a non-number
const encodeExport = (index: number) => `a${index}`

/** Replace all \ with / if importing on Windows */
const formatPathForImport = (p: string) =>
  p.replaceAll(path.sep, path.posix.sep)

/**
 * Given an array of file paths, build a string containing
 * export statements for each path, assuming a default export.
 * Objects are exported as a{index}
 */
export const buildPages = (
  pages: string[],
  pageFilename: string,
  shouldExport: boolean
) => {
  const files = pages.map((p) => path.join(p, pageFilename))

  if (files.length === 0) {
    return ''
  }

  const imports = files.reduce((content, file, i) => {
    const importPath = formatPathForImport(file)

    return `${content}import {default as ${encodeExport(i)}} from "./${importPath}";\n`
  }, '')

  // Using pages.length; so that esbuild thinks pages is being used and is thus
  // not removed from the bundle
  const lastLine = shouldExport ? 'export default pages;' : 'pages.length;'

  return `
    ${imports}
    const pages = [${files.map((f, i) => encodeExport(i)).join(',')}];
    ${lastLine}  
  `
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
