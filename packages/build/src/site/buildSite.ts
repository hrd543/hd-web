import { BuildSiteConfig, validateConfig } from './config.js'
import path from 'path'
import url from 'url'
import fs from 'fs/promises'
import { type Adapter } from '@hd-web/adapters'
import { processJs } from './processJs.js'
import { bundleFinalPass, bundleFirstPass } from './bundleJs.js'
import { writeToHtml } from './writeToHtml.js'
import { buildPages } from '../shared/pages.js'
import { initialiseInteractive } from '../shared/interactivity.js'

/**
 * Create the html, css and js files for a site.
 *
 * This will run the default page function in entry and use that to create
 * an index.html file for each page in the out directory.
 *
 * Only one js and css file is built at the root, but async imports will
 * be split into their own module.
 *
 * Will delete the contents of out before building!
 *
 * Supply an adapter to modify the build for a specific hosting provider.
 */
export const buildSite = async (
  rawConfig: Partial<BuildSiteConfig>,
  adapter?: Adapter
) => {
  let config = validateConfig(rawConfig)
  if (adapter?.before) {
    config = await adapter.before(config)
  }

  const { entry, out, staticFolder } = config

  // Delete the build folder
  await fs.rm(out, { recursive: true, force: true })

  // Copy over any static assets
  if (staticFolder) {
    await fs.cp(staticFolder, out, { recursive: true })
  }

  const entryDir = path.dirname(entry)

  // Need to define the global types BEFORE importing the component
  initialiseInteractive()

  const builtFiles = await bundleFirstPass(entry, out)
  const outFile = builtFiles.find((file) => file.isEntry)!.path
  const pages = await buildPages(
    out,
    (await import(url.pathToFileURL(outFile).href)).default
  )

  // This needs to be done after the pages have been built so that
  // the custom elements contain all which are referenced.
  await processJs(outFile)

  await Promise.all([
    writeToHtml(pages, entryDir, builtFiles),
    bundleFinalPass(outFile)
  ])

  await adapter?.after?.(out)
}
