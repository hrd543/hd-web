import { RequestHandler } from 'express'
import { ViteDevServer } from 'vite'

import { getClientJs } from '../client/index.js'
import { buildPages, BuiltPage } from '../shared/index.js'
import { buildHtml, createMeta } from '../shared/index.js'
import { addJsToEmptyScript, buildEmptyScript } from './buildInlineScript.js'
import { DevConfig } from './config.js'
import { findClientFiles } from './findClientFiles.js'
import { getCssImports } from './getCssImports.js'
import { getLatest } from './getLatest.js'
import { getPageContent } from './getPageContent.js'
import { isPage } from './isPage.js'

type RebuildResult = {
  pages: BuiltPage[]
  cssImports: string
}

type UpdateType = 'update' | 'delete' | 'add'

export const getServeHtml = (
  config: DevConfig,
  server: ViteDevServer
): RequestHandler => {
  const [getRebuilt, rebuild] = getLatest<RebuildResult, UpdateType>(
    async (old, type) => {
      const siteFn = (await server.ssrLoadModule(config.entry)).default
      const cssImports = getCssImports(server.moduleGraph)

      // We only need to rebuild the pages on update (or initial load)
      if (type === 'update' || old === null) {
        return {
          pages: await buildPages(siteFn, config.joinTitles),
          cssImports
        }
      }

      // But we need to update the css imports all the time
      return {
        ...old,
        cssImports
      }
    }
  )

  rebuild('update')()
  server.watcher.on('change', rebuild('update'))
  server.watcher.on('add', rebuild('add'))
  server.watcher.on('unlink', rebuild('delete'))

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
