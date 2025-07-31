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

      console.log(1)
      const importPath = url.pathToFileURL(path.join(process.cwd(), entry)).href
      console.log(importPath)
      const pages = await buildPages(
        (await import(importPath)).default,
        joinTitles
      )

      console.log(2)

      const { map, html } = getHtml(pages)
      const { imports, entries } = loopComponents(map)

      const clientFile = `export const client = <T extends JSX.BaseProps>(
        components: Map<string, JSX.IComponent<T>>
      ) => {
        document
          .querySelectorAll<HTMLElement | SVGElement>(\`[data-hd-id]\`)
          .forEach((element) => {
            const Comp = components.get(element.dataset.hdId ?? '')
      
            if (Comp) {
              new Comp(element)
            }
          })
      }`
      const client = build.esbuild
        .transformSync(clientFile, {
          format: 'esm',
          loader: 'ts',
          target: 'esnext'
        })
        .code.replace(/export[^;]+;/, 'return client;')

      console.log(3)

      await fs.writeFile(
        outFile,
        `
        ${imports}
        const init = () => {${client}}

        int(new Map(${entries}));
      `
      )

      console.log('here')

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
