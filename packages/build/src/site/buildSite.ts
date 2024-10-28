import { BuildSiteConfig, validateConfig } from './config.js'
import path from 'path'
import url from 'url'
import { processJs } from './processJs.js'
import { bundleFinalPass, bundleFirstPass } from './bundleJs.js'
import { writeToHtml } from './writeToHtml.js'
import { initialiseGlobals } from '../shared/customElements.js'
import { buildPages } from '../shared/pages.js'

/**
 * Create the html, css and js files for a site.
 *
 * This will run the default page function in entry and use that to create
 * an index.html file for each page in the out directory.
 *
 * Only one js and css file is built at the root.
 */
export const buildSite = async (rawConfig: Partial<BuildSiteConfig>) => {
  const { entry, out } = validateConfig(rawConfig)
  const entryDir = path.dirname(entry)

  // Need to define the global types BEFORE importing the component
  const getCustomElements = initialiseGlobals()

  const builtFiles = await bundleFirstPass(entry, out)
  const outFile = builtFiles.find((file) => file.isEntry)!.path
  const pages = await buildPages(
    out,
    (await import(url.pathToFileURL(outFile).href)).default
  )

  // This needs to be done after the pages have been built so that
  // the custom elements contain all which are referenced.
  await processJs(outFile, getCustomElements)

  await Promise.all([
    writeToHtml(pages, entryDir, builtFiles),
    bundleFinalPass(outFile)
  ])
}
