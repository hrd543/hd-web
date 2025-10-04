import express from 'express'
import * as esbuild from 'esbuild'
import fs from 'fs/promises'

import { DevConfig, validateConfig } from './config.js'
import { formatHtmlRoutes } from './formatHtmlRoutes.js'
import { getServeHtml } from './serveHtml.js'
import { Plugin, filterPlugins } from '../plugins/index.js'
import { getEsbuildContext } from './buildDev.js'
import { getLatest } from './getLatest.js'
import { buildSite, BuiltSite } from '../shared/index.js'
import { getSite } from './getSite.js'
import { HdError } from '../errors/HdError.js'

type RebuildResult = {
  site: BuiltSite
  css: string
}

type UpdateType = 'update' | 'delete' | 'add'

export const dev = async (
  config: Partial<DevConfig> = {},
  allPlugins: Array<Plugin<DevConfig>> = []
) => {
  config.write = false
  const plugins = filterPlugins(allPlugins, 'dev')
  const fullConfig = validateConfig(config, plugins)
  const app = express()

  const context = await getEsbuildContext(fullConfig, allPlugins)

  const [getRebuilt, rebuild] = getLatest<RebuildResult, UpdateType>(
    async (old, type) => {
      try {
        const bef = performance.now()
        const first = await context.rebuild()
        const outfile = first.outputFiles!.find((f) =>
          f.path.endsWith('.js')
        )!.path
        const css = first.outputFiles!.find((f) =>
          f.path.endsWith('.css')
        )!.text
        const site = await buildSite(
          await getSite(outfile, first.outputFiles),
          fullConfig
        )

        console.log('Took: ', performance.now() - bef)

        return {
          site,
          css
        }
      } catch (e: unknown) {
        if (!isEsbuildError(e)) {
          throw e
        }

        throw new HdError('fs.fileType', e.message)
      }
    }
  )

  rebuild('update')()

  watch(rebuild('update'))

  app.use(formatHtmlRoutes, getServeHtml(fullConfig, plugins, getRebuilt))

  app.listen(fullConfig.port)

  console.log('Hd-web dev server running at:', fullConfig.port)
}

const isEsbuildError = (e: unknown): e is esbuild.BuildFailure =>
  e instanceof Error &&
  'errors' in e &&
  Array.isArray(e.errors) &&
  e.errors.length > 0

const watch = async (rebuild: () => void) => {
  const watcher = fs.watch(process.cwd(), { recursive: true })

  for await (const event of watcher) {
    rebuild()
  }
}
