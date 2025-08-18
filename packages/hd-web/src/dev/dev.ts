import express from 'express'
import { createServer } from 'vite'
import { Site } from '../types/index.js'
import { isPage } from './isPage.js'
import { getPage } from './getPage.js'
import { serveHtmlFiles } from './serveHtmlFiles.js'
import { getClientJs } from '../client/index.js'
import { findClientFiles } from './findClientFiles.js'
import { stringifyNode } from '../stringify/index.js'

export const dev = async () => {
  const app = express()

  const server = await createServer({
    root: process.cwd(), // optional, defaults to CWD
    server: {
      port: 3000, // you can set any port here,
      middlewareMode: true
    },
    appType: 'custom'
  })

  let site: Site | undefined

  // TODO Make sure this is debounced properly.
  const updateSite = async () => {
    site = (await server.ssrLoadModule('./App.tsx')).default()
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
    const { html, components } = stringifyNode(page.body())

    res.end(
      await server.transformIndexHtml(
        req.originalUrl,
        `<html>
            <script type="module">${getClientJs(findClientFiles(server.moduleGraph, components))}</script>
            ${html}
          </html>`
      )
    )
  })

  app.listen(3000)

  console.log('Vite dev server running at:', server.resolvedUrls?.local?.[0])
}
