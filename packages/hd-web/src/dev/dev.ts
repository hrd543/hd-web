import express from 'express'
import { createServer } from 'vite'
import { formatHtmlRoutes } from './formatHtmlRoutes.js'
import { DevConfig, validateConfig } from './config.js'
import { getServeHtml } from './serveHtml.js'

export const dev = async (config: Partial<DevConfig> = {}) => {
  const fullConfig = validateConfig(config)
  const app = express()

  const server = await createServer({
    root: process.cwd(),
    server: {
      port: fullConfig.port,
      middlewareMode: true
    },
    appType: 'custom'
  })

  app.use(
    server.middlewares,
    formatHtmlRoutes,
    getServeHtml(fullConfig, server)
  )

  app.listen(fullConfig.port)

  console.log('Vite dev server running at:', fullConfig.port)
}
