import * as esbuild from 'esbuild'

import { BuildDevConfig } from '../dev/config.js'

import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import { BuildSiteConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import path from 'path'
import { writeToHtml } from './writeToHtml.js'
import { Adapter, runAfterAdapters, runBeforeAdapters } from './adapters.js'
import {
  getEntryPoint,
  getHtml,
  getOutFolder,
  loopComponents,
  readMetafile
} from './pluginHelpers.js'
import { IFileSystem } from '../shared/filesystem.js'

export const hdDevPlugin = (
  rawConfig: Partial<BuildSiteConfig>,
  adapters: Adapter[],
  fileSystem: IFileSystem
): esbuild.Plugin => ({
  name: 'hd-dev-plugin',
  async setup(build) {
    const config = await runBeforeAdapters(validateConfig(rawConfig), adapters)
    const { staticFolder, joinTitles } = config
    const entry = getEntryPoint(build.initialOptions)
    const out = getOutFolder(build.initialOptions)
    const outFile = path.join(out, 'main.js')

    await fileSystem.clear()

    const pages = await buildPages(
      (await import(import.meta.resolve(entry))).default,
      joinTitles
    )

    const { map, html } = getHtml(pages)
    const { imports, entries } = loopComponents(map)

    await fileSystem.write(
      outFile,
      `
        ${imports}
        import { client } from "./client.ts"

        client(new Map(${entries}));
      `
    )
  }
})
