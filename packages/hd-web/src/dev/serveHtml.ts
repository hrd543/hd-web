import { Site } from '../types/index.js'
import { isPage } from './isPage.js'
import { getPage } from './getPage.js'
import { getClientJs } from '../client/index.js'
import { findClientFiles } from './findClientFiles.js'
import { DevConfig } from './config.js'
import { buildHtml, createMeta } from '../shared/index.js'
import { addJsToEmptyScript, buildEmptyScript } from './buildInlineScript.js'
import { ViteDevServer } from 'vite'
import { RequestHandler } from 'express'
import { throttle } from './throttle.js'

export const getServeHtml = (
  config: DevConfig,
  server: ViteDevServer
): RequestHandler => {
  const [getSite, updateSite] = throttle<Site>(async () => {
    // server.ws.send({ type: 'full-reload' })

    return (await server.ssrLoadModule(config.entry)).default()
  })

  server.watcher.on('change', updateSite)
  // Don't need remove / add listeners since that wouldn't change the routing.

  return async (req, res, next) => {
    if (!isPage(req.url)) {
      next()
    }

    const site = await getSite()

    if (site === null) {
      res.statusCode = 202

      return res.end('Waiting for data')
    }

    // TODO make this sync as site should actually be BuiltSite
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
      config.lang
    )

    const withJs = addJsToEmptyScript(
      html,
      getClientJs(findClientFiles(server.moduleGraph, components))
    )

    res.end(await server.transformIndexHtml(req.originalUrl, withJs))
  }
}
