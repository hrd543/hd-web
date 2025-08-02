import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import { BuildSiteConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import path from 'path'
import { writeToHtml } from './writeToHtml.js'
import { getOutFolder, readMetafile } from './pluginHelpers.js'
import { getClientCode } from './client.js'
import { BuiltPage, SiteFunction } from '../shared/types.js'
import { removeDecorators } from './removeDecorators.js'

// You have to export your component from the file as its name otherwise it won't
// work.
// E.g. export const Component = ...
// Need to add some sort of warning if not the case

export const hdPlugin = (
  site: SiteFunction,
  rawConfig: Partial<BuildSiteConfig>
): esbuild.Plugin => ({
  name: 'hd-plugin',
  async setup(build) {
    const config = validateConfig(rawConfig)
    const { staticFolder, joinTitles } = config
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
      const files = readMetafile(result.metafile!, out)
      await writeToHtml(pages, config, files, out)
    })

    build.onDispose(() => {
      pages = []
    })

    if (!config.dev) {
      build.onLoad({ filter: /\.tsx$/ }, async (args) => {
        return {
          contents: removeDecorators(await fs.readFile(args.path, 'utf8')),
          loader: 'tsx'
        }
      })
    }

    build.initialOptions.entryPoints = [outFile]
    build.initialOptions.allowOverwrite = true
    build.initialOptions.treeShaking = true
    build.initialOptions.bundle = true
    build.initialOptions.metafile = true
  }
})
