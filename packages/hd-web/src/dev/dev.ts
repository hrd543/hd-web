import express from 'express'

import { DevConfig, validateConfig } from './config.js'
import { formatHtmlRoutes } from './formatHtmlRoutes.js'
import { getServeHtml } from './serveHtml.js'
import { getLatest } from './getLatest.js'
import { getDevRebuildCallback } from './rebuildDev.js'
import { watch } from './watch.js'
import { filterPlugins, Plugin, runPluginCallbacks } from '../plugins/index.js'

export const dev = async (
  config: Partial<DevConfig> = {},
  allPlugins: Plugin<DevConfig>[] = []
) => {
  const plugins = filterPlugins(allPlugins, 'dev')
  const fullConfig = validateConfig(config)
  const app = express()
  await runPluginCallbacks(fullConfig, plugins, 'onStart')

  const [getRebuilt, triggerRebuild] = getLatest(
    await getDevRebuildCallback(fullConfig, plugins)
  )

  triggerRebuild()
  watch(triggerRebuild)

  app.use(
    formatHtmlRoutes,
    express.static(process.cwd()),
    getServeHtml(fullConfig, plugins, getRebuilt)
  )

  app.listen(fullConfig.port)

  console.log('Hd-web dev server running at:', fullConfig.port)
}
