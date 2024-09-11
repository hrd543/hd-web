import { BuildSiteConfig, validateConfig } from '../shared/config.js'
import { getBuildFile } from '../shared/files.js'
import { initialiseGlobals } from '../shared/globals.js'
import { getActivePages, validatePages } from '../shared/pages.js'
import { defaultConfig } from '../shared/constants.js'
import { processJs } from './processJs.js'
import { removeUnusedCode } from './removeUnusedCode.js'
import { writeToHtml } from './writeToHtml.js'
import { getPageBuilders } from './getPageBuilders.js'

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
  const outFile = getBuildFile(outDir)

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
