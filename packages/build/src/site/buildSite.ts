import { BuildSiteConfig, validateConfig } from './config.js'
import path from 'path'
import url from 'url'
import { buildFile } from '../shared/constants.js'
import { processJs } from './processJs.js'
import { bundleFinalPass, bundleFirstPass } from './bundleJs.js'
import { writeToHtml } from './writeToHtml.js'
import { initialiseGlobals } from '../shared/customElements.js'
import { buildPages } from '../shared/pages.js'

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
  const { entry, out } = validateConfig(rawConfig)
  const entryDir = path.dirname(entry)

  // Need to define the global types BEFORE importing the component
  const getCustomElements = initialiseGlobals()
  const outFile = path.resolve(out, buildFile)

  await bundleFirstPass(entry, out)
  const pages = await buildPages(
    out,
    (await import(url.pathToFileURL(outFile).href)).default
  )

  // This needs to be done after the pages have been built so that
  // the custom elements contain all which are referenced.
  await processJs(outFile, getCustomElements)

  await Promise.all([
    await bundleFinalPass(outFile),
    await writeToHtml(pages, entryDir)
  ])
}
