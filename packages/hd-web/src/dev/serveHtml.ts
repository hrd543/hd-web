import { buildPages, BuiltPage } from '../shared/index.js'
import { isPage } from './isPage.js'
import { getPageContent } from './getPageContent.js'
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
  const [getSite, updateSite] = throttle<BuiltPage[]>(async () => {
    // server.ws.send({ type: 'full-reload' })

    const siteFn = (await server.ssrLoadModule(config.entry)).default

    return buildPages(siteFn, config.joinTitles)
  })

  server.watcher.on('change', updateSite)
  // Don't need remove / add listeners since that wouldn't change the routing.

  return async (req, res, next) => {
    if (!isPage(req.url)) {
      next()
    }

    const content = await getPageContent(req.url, getSite)

    if (content === null) {
      res.statusCode = 202
      return res.end('Waiting for data')
    }

    if (content === undefined) {
      res.statusCode = 404
      return res.end('Not found')
    }

    const { html, components } = buildHtml(
      createMeta(
        content.title,
        content.description,
        content.head(),
        buildEmptyScript()
      ),
      content.body(),
      config.lang
    )

    const withJs = addJsToEmptyScript(
      html,
      getClientJs(findClientFiles(server.moduleGraph, components))
    )

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(await server.transformIndexHtml(req.originalUrl, withJs))
  }
}
