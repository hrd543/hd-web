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

export const getServeHtml = async (
  config: DevConfig,
  server: ViteDevServer
): Promise<RequestHandler> => {
  let site: Site | undefined

  const updateSite = async () => {
    site = (await server.ssrLoadModule(config.entry)).default()
  }

  await updateSite()

  server.watcher.on('change', updateSite)
  // Don't need remove / add listeners since that wouldn't change the routing.

  return async (req, res, next) => {
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
      config.lang
    )

    const withJs = addJsToEmptyScript(
      html,
      getClientJs(findClientFiles(server.moduleGraph, components))
    )

    res.end(await server.transformIndexHtml(req.originalUrl, withJs))
  }
}
