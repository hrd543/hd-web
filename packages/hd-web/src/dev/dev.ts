import express from 'express'

import { DevConfig, validateConfig } from './config.js'
import { formatHtmlRoutes } from './formatHtmlRoutes.js'
import { getServeHtml } from './serveHtml.js'
import { Plugin, filterPlugins } from '../plugins/index.js'
import { getLatest } from './getLatest.js'
import { getDevRebuildCallback } from './rebuildDev.js'
import { watch } from './watch.js'

export const dev = async (
  config: Partial<DevConfig> = {},
  allPlugins: Array<Plugin<DevConfig>> = []
) => {
  const plugins = filterPlugins(allPlugins, 'dev')
  const fullConfig = validateConfig(config, plugins)
  const app = express()

  const [getRebuilt, triggerRebuild] = getLatest(
    await getDevRebuildCallback(fullConfig, plugins)
  )

  triggerRebuild()
  watch(triggerRebuild)

  app.use(formatHtmlRoutes, getServeHtml(fullConfig, plugins, getRebuilt))

  app.listen(fullConfig.port)

  console.log('Hd-web dev server running at:', fullConfig.port)
}
