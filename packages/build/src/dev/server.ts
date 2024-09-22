import http from 'http'
import path from 'path'
import { WebSocketServer, type WebSocket } from 'ws'
import { mimeTypes } from './mimeTypes.js'
import FileSystem from './filesystem.js'

export const createDevServer = (
  port: number,
  filesystem: FileSystem
): (() => WebSocket | null) => {
  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      return
    }

    // parse URL
    const parsedUrl = new URL(req.url, `http://localhost:${port}`)

    if (!parsedUrl) {
      return
    }

    const pathname = path.normalize(parsedUrl.pathname)

    const filename = filesystem.exists(pathname)
      ? pathname
      : path.join(pathname, 'index.html')
    const content = filesystem.read(filename)

    if (!content) {
      res.statusCode = 404
      res.end(`File ${pathname} not found`)
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
