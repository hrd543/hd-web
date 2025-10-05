import express from 'express'

import { DevConfig, validateConfig } from './config.js'
import { formatHtmlRoutes } from './formatHtmlRoutes.js'
import { getServeHtml } from './serveHtml.js'
import { getLatest } from './getLatest.js'
import { getDevRebuildCallback } from './rebuildDev.js'
import { watch } from './watch.js'

export const dev = async (config: Partial<DevConfig> = {}) => {
  const fullConfig = validateConfig(config)
  const app = express()

  const [getRebuilt, triggerRebuild] = getLatest(
    await getDevRebuildCallback(fullConfig)
  )

  triggerRebuild()
  watch(triggerRebuild)

  app.use(
    formatHtmlRoutes,
    express.static(process.cwd()),
    getServeHtml(fullConfig, getRebuilt)
  )

  app.listen(fullConfig.port)

  console.log('Hd-web dev server running at:', fullConfig.port)
}
