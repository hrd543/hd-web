import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import { BuildSiteConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import path from 'path'
import { writeToHtml } from './writeToHtml.js'
import { getEntryPoint, getOutFolder, readMetafile } from './pluginHelpers.js'
import { getClientCode } from './client.js'
import { BuiltPage, SiteFunction } from '../shared/types.js'

export const hdPlugin = (
  site: SiteFunction,
  rawConfig: Partial<BuildSiteConfig>
): esbuild.Plugin => ({
  name: 'hd-plugin',
  async setup(build) {
    const config = validateConfig(rawConfig)
    const { staticFolder, joinTitles } = config
    const entry = getEntryPoint(build.initialOptions)
    const out = getOutFolder(build.initialOptions)
    const outFile = path.join(out, 'main.js')

    // Copy over any static assets
    if (staticFolder) {
      await fs.cp(staticFolder, out, { recursive: true })
    }

    let pages: BuiltPage[] = []

    build.onStart(async () => {
      // Reset the contents of the build folder.
      await fs.rm(out, { recursive: true, force: true })
      await fs.mkdir(out)

      pages = await buildPages(site, joinTitles)

      await fs.writeFile(outFile, getClientCode(pages))
    })

    build.onEnd(async (result) => {
      // Write the html files linking the built files.
      const files = readMetafile(result.metafile!, entry, out)
      await writeToHtml(pages, config, files, out)
    })

    build.onDispose(() => {
      pages = []
    })

    build.initialOptions.entryPoints = [outFile]
    build.initialOptions.allowOverwrite = true
    build.initialOptions.treeShaking = true
    build.initialOptions.bundle = true
    build.initialOptions.metafile = true
  }
})
