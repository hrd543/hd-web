import express from 'express'
import { createServer } from 'vite'
import { Site } from '../types/index.js'
import { isPage } from './isPage.js'
import { getPage } from './getPage.js'
import { serveHtmlFiles } from './serveHtmlFiles.js'
import { getClientJs } from '../client/index.js'
import { findClientFiles } from './findClientFiles.js'
import { DevConfig, validateConfig } from './config.js'
import { buildHtml, createMeta } from '../shared/index.js'
import {
  addJsToEmptyScript,
  buildEmptyScript
} from '../client/buildInlineScript.js'

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

  let site: Site | undefined

  // TODO Make sure this is debounced properly.
  const updateSite = async () => {
    site = (await server.ssrLoadModule(fullConfig.entry)).default()
  }

  await updateSite()

  server.watcher.on('change', updateSite)
  // Don't need remove / add listeners since that wouldn't change the routing.

  app.use(server.middlewares)

  app.use(serveHtmlFiles)

  app.use(async (req, res, next) => {
    if (!isPage(req.url)) {
      next()
    }

    const page = await getPage(req.url, site)

    if (!page) {
      res.statusCode = 404
      return res.end('Not found')
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    // TODO fix the head being undefined here and title joins.
    const { html, components } = buildHtml(
      createMeta(
        page.title,
        page.description,
        page.head?.() ?? null,
        buildEmptyScript()
      ),
      page.body(),
      fullConfig.lang
    )

    const withJs = addJsToEmptyScript(
      html,
      getClientJs(findClientFiles(server.moduleGraph, components))
    )

    res.end(await server.transformIndexHtml(req.originalUrl, withJs))
  })

  app.listen(fullConfig.port)

  console.log('Vite dev server running at:', fullConfig.port)
}
