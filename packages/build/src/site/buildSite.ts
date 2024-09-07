import { initialiseGlobals } from './globals.js'
import { removeUnusedCode } from './removeUnusedCode.js'
import { writeToHtml } from './writeToHtml.js'
import { buildFile, defaultConfig } from './constants.js'
import * as path from 'path'
import { validatePages } from './validatePages.js'
import { getActivePages } from './getActivePages.js'
import { processJs } from './processJs.js'
import { getPageBuilders } from './getPageBuilders.js'
import { BuildSiteConfig, validateConfig } from './config.js'

/**
 * Create the html, css and js files for a site given the entry and out
 * directories.
 *
 * This will go through each folder in entry and look for a page file.
 * These page files should default export a function which returns a string,
 * representing the body html for that page.
 *
 * An index.html file will be created for each of these pages in the out
 * directory, matching the folder structure found in entry.
 *
 * Only one js and css file is built at the root.
 */
export const buildSite = async (rawConfig: Partial<BuildSiteConfig>) => {
  const { entryDir, outDir, pageFilename } = validateConfig(rawConfig)
  // Need to define the global types BEFORE importing the component
  const getCustomElements = initialiseGlobals()
  const outFile = path.resolve(outDir, buildFile)

  const activePages = await getActivePages(entryDir, pageFilename)
  const pageBuilders = await getPageBuilders(
    entryDir,
    outFile,
    activePages,
    pageFilename
  )

  const [htmlContents] = await Promise.all([
    await validatePages(pageBuilders, activePages),
    await processJs(outFile, getCustomElements)
  ])

  await Promise.all([
    await removeUnusedCode(outFile, defaultConfig),
    await writeToHtml(activePages, htmlContents, entryDir, outDir)
  ])
}
