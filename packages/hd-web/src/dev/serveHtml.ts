import { RequestHandler } from 'express'
import { ViteDevServer } from 'vite'

import { getClientJs } from '../client/index.js'
import { buildSite, BuiltSite, renderPage } from '../shared/index.js'
import { buildHtml, createMeta } from '../shared/index.js'
import { addJsToEmptyScript, buildEmptyScript } from './buildInlineScript.js'
import { DevConfig } from './config.js'
import { findClientFiles } from './findClientFiles.js'
import { getCssImports } from './getCssImports.js'
import { getLatest } from './getLatest.js'
import { getPageContent } from './getPageContent.js'
import { isPage } from './isPage.js'
import { HdPlugin, runPlugins } from '../plugins/index.js'

type RebuildResult = {
  site: BuiltSite
  cssImports: string[]
}

type UpdateType = 'update' | 'delete' | 'add'

export const getServeHtml = (
  config: DevConfig,
  plugins: Array<HdPlugin<DevConfig>>,
  server: ViteDevServer
): RequestHandler => {
  const [getRebuilt, rebuild] = getLatest<RebuildResult, UpdateType>(
    async (old, type) => {
      const site = (await server.ssrLoadModule(config.entry)).default
      const cssImports = getCssImports(server.moduleGraph)

      // We only need to rebuild the pages on update (or initial load)
      if (type === 'update' || old === null) {
        return {
          site: await buildSite(site, config),
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

    await runPlugins(config, plugins, 'start')
    const rebuilt = await getRebuilt()

    if (rebuilt === null) {
      res.statusCode = 202
      return res.end('Waiting for data')
    }

    const page = await getPageContent(req.url, rebuilt.site.pages)

    if (page === undefined) {
      res.statusCode = 404
      return res.end('Not found')
    }

    const { head, body } = renderPage(rebuilt.site, page)
    const { html, components } = buildHtml(
      createMeta(
        page.title,
        page.description,
        head,
        buildEmptyScript(rebuilt.cssImports)
      ),
      body,
      config.lang,
      true
    )

    const js = findClientFiles(server.moduleGraph, components)
    const componentJs = getClientJs(js)
    const withJs = addJsToEmptyScript(html, componentJs)

    await runPlugins(config, plugins, 'end')

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(await server.transformIndexHtml(req.originalUrl, withJs))
  }
}
