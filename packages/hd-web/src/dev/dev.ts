import express from 'express'
import { createServer } from 'vite'

import { DevConfig, validateConfig } from './config.js'
import { formatHtmlRoutes } from './formatHtmlRoutes.js'
import { getServeHtml } from './serveHtml.js'
import { Plugin, filterPlugins } from '../plugins/index.js'
import { devPlugin } from './devPlugin.js'

export const dev = async (
  config: Partial<DevConfig> = {},
  allPlugins: Array<Plugin<DevConfig>> = []
) => {
  const plugins = filterPlugins(allPlugins, 'dev')
  const fullConfig = validateConfig(config, plugins)
  const app = express()

  const server = await createServer({
    root: process.cwd(),
    server: {
      port: fullConfig.port,
      middlewareMode: true
    },
    appType: 'custom',
    ssr: {
      // This makes sure these node_modules are transformed by vite
      noExternal: ['@hd-web/components', ...fullConfig.dependenciesToTransform]
    },
    plugins: [devPlugin(plugins, fullConfig)]
  })

  app.use(
    server.middlewares,
    formatHtmlRoutes,
    getServeHtml(fullConfig, plugins, server)
  )

  app.listen(fullConfig.port)

  console.log('Vite dev server running at:', fullConfig.port)
}
