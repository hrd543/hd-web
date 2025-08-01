import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import { BuildSiteConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import path from 'path'
import { writeToHtml } from './writeToHtml.js'
import {
  getEntryPoint,
  getHtml,
  getOutFolder,
  loopComponents,
  readMetafile
} from './pluginHelpers.js'
import url from 'url'
import { getClientCode } from './client.js'

export const hdPlugin = (
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

    build.onStart(async () => {
      // Delete the build folder
      // await fs.rm(out, { recursive: true, force: true })

      const importPath = url.pathToFileURL(path.join(process.cwd(), entry)).href
      const pages = await buildPages(
        (await import(importPath)).default,
        joinTitles
      )

      const { map, html } = getHtml(pages)
      const { imports, entries } = loopComponents(map)

      await fs.writeFile(
        outFile,
        `
        ${imports}
        ${getClientCode(entries)}
      `
      )

      return {
        warnings: [
          {
            pluginName: 'hd-plugin',
            detail: {
              html,
              pages
            }
          }
        ]
      }
    })

    build.onEnd(async (result) => {
      const { html, pages } = result.warnings.find(
        (m) => m.pluginName === 'hd-plugin'
      )!.detail
      // Write the html files linking the built files.
      const files = readMetafile(result.metafile!, entry, out)
      await writeToHtml(pages, config, files, html, out)
    })

    build.initialOptions.entryPoints = [outFile]
    build.initialOptions.allowOverwrite = true
    build.initialOptions.treeShaking = true
    build.initialOptions.bundle = true
    build.initialOptions.metafile = true
  }
})
