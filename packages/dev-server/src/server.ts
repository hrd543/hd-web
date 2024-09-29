import http from 'http'
import path from 'path'
import { WebSocketServer, type WebSocket } from 'ws'
import { mimeTypes } from './mimeTypes.js'

type FileSystem = {
  exists: (file: string) => boolean | Promise<boolean>
  read: (file: string) => string | undefined | Promise<string | undefined>
}

/**
 * Create a simple dev server. Don't use in production.
 * @param port The port at which the server will be used
 * @param filesystem Provide methods for reading and checking existence of a file.
 * This could be the actual file system, or some sort of in memory version.
 * @param page404 The name of the 404 page, if any
 * @returns
 */
export const createDevServer = (
  port: number,
  filesystem: FileSystem,
  page404 = '404.html'
): (() => WebSocket | null) => {
  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      return
    }

    const parsedUrl = new URL(req.url, `http://localhost:${port}`)
    if (!parsedUrl) {
      return
    }

    const pathname = path.normalize(parsedUrl.pathname)

    const filename = (await filesystem.exists(pathname))
      ? pathname
      : path.join(pathname, 'index.html')
    const content = await filesystem.read(filename)

    if (!content) {
      res.statusCode = 404
      if (filesystem.exists(page404)) {
        res.setHeader('Content-type', mimeTypes['html'] || 'text/plain')
        res.end(await filesystem.read(page404))
      } else {
        res.end(`File ${pathname} not found`)
      }
    } else {
      const ext = path.extname(filename)
      res.setHeader('Content-type', mimeTypes[ext] || 'text/plain')
      res.end(content)
    }
  })

  const wsServer = new WebSocketServer({ server })
  let ws: WebSocket | null = null

  wsServer.on('connection', (_ws) => {
    ws = _ws
  })

  server.listen(port)

  return () => ws
}
