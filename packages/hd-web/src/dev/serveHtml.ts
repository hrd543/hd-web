import { RequestHandler } from 'express'
import { ViteDevServer } from 'vite'

import { getClientJs } from '../client/index.js'
import { buildPages, BuiltPage } from '../shared/index.js'
import { buildHtml, createMeta } from '../shared/index.js'
import { addJsToEmptyScript, buildEmptyScript } from './buildInlineScript.js'
import { DevConfig } from './config.js'
import { findClientFiles } from './findClientFiles.js'
import { getCssImports } from './getCssImports.js'
import { getPageContent } from './getPageContent.js'
import { isPage } from './isPage.js'
import { throttle } from './throttle.js'

type RebuildResult = {
  pages: BuiltPage[]
  cssImports: string
}

export const getServeHtml = (
  config: DevConfig,
  server: ViteDevServer
): RequestHandler => {
  const [getRebuilt, rebuild] = throttle<RebuildResult>(async () => {
    const siteFn = (await server.ssrLoadModule(config.entry)).default

    return {
      pages: await buildPages(siteFn, config.joinTitles),
      cssImports: getCssImports(server.moduleGraph)
    }
  })

  // Don't need remove / add listeners since that wouldn't change the routing.
  server.watcher.on('change', rebuild)

  return async (req, res, next) => {
    if (!isPage(req.url)) {
      next()
    }

    const rebuilt = await getRebuilt()

    if (rebuilt === null) {
      res.statusCode = 202
      return res.end('Waiting for data')
    }

    const content = await getPageContent(req.url, rebuilt.pages)

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

    const js = findClientFiles(server.moduleGraph, components)
    const componentJs = getClientJs(js)
    const withJs = addJsToEmptyScript(html, rebuilt.cssImports + componentJs)

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(await server.transformIndexHtml(req.originalUrl, withJs))
  }
}
