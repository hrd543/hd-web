import http from 'http'
import path from 'path'
import fs from 'fs/promises'
import { WebSocketServer, type WebSocket } from 'ws'
import { mimeTypes } from './mimeTypes.js'

export const createDevServer = (
  port: number,
  outDir: string
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

    const pathname = path.join(outDir, path.normalize(parsedUrl.pathname))

    try {
      const info = await fs.stat(pathname)
      const filename = info.isDirectory()
        ? path.join(pathname, 'index.html')
        : pathname
      const content = await fs.readFile(filename)
      const ext = path.extname(filename)
      // if the file is found, set Content-type and send data
      res.setHeader('Content-type', mimeTypes[ext] || 'text/plain')
      res.end(content)
    } catch {
      res.statusCode = 404
      res.end(`File ${pathname} not found`)
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
