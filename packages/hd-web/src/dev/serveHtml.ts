import { RequestHandler } from 'express'

import { getClientJs } from '../client/index.js'
import { renderPage } from '../shared/index.js'
import { buildHtml, createMeta } from '../shared/index.js'
import { addJsToEmptyScript, buildEmptyScript } from './buildInlineScript.js'
import { DevConfig } from './config.js'
import { getPageContent } from './getPageContent.js'
import { isPage } from './isPage.js'
import { Plugin, runPlugins } from '../plugins/index.js'
import { DevRebuild } from './types.js'
import { transformClientJs } from './transformClientJs.js'

export const getServeHtml = (
  config: DevConfig,
  plugins: Array<Plugin<DevConfig>>,
  getRebuilt: () => Promise<DevRebuild | null>
): RequestHandler => {
  return async (req, res, next) => {
    if (!isPage(req.url)) {
      next()
    }

    await runPlugins(config, plugins, 'start', 'dev')
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
        buildEmptyScript(rebuilt.css)
      ),
      body,
      config.lang,
      true
    )

    const componentJs = getClientJs(components.map(({ filename }) => filename))
    const built = await transformClientJs(componentJs)
    const withJs = addJsToEmptyScript(html, built)

    await runPlugins(config, plugins, 'end', 'dev')

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(withJs)
  }
}
