import express from 'express'
import fs from 'fs/promises'

import { DevConfig, validateConfig } from './config.js'
import { formatHtmlRoutes } from './formatHtmlRoutes.js'
import { getServeHtml } from './serveHtml.js'
import { Plugin, filterPlugins } from '../plugins/index.js'
import { getEsbuildContext } from './buildDev.js'
import { getLatest } from './getLatest.js'
import { debounce } from './debounce.js'
import { rebuildDev } from './rebuildDev.js'

export const dev = async (
  config: Partial<DevConfig> = {},
  allPlugins: Array<Plugin<DevConfig>> = []
) => {
  const plugins = filterPlugins(allPlugins, 'dev')
  const fullConfig = validateConfig(config, plugins)
  const app = express()

  const context = await getEsbuildContext(fullConfig, allPlugins)

  const [getRebuilt, rebuild] = getLatest(
    async () => await rebuildDev(fullConfig, context)
  )

  rebuild()

  watch(rebuild)

  app.use(formatHtmlRoutes, getServeHtml(fullConfig, plugins, getRebuilt))

  app.listen(fullConfig.port)

  console.log('Hd-web dev server running at:', fullConfig.port)
}

const watch = async (rebuild: () => void) => {
  const watcher = fs.watch(process.cwd(), { recursive: true })
  const debounced = debounce(rebuild, 100)

  for await (const event of watcher) {
    debounced()
  }
}
