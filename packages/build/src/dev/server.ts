import http from 'http'
import path from 'path'
import fs from 'fs/promises'
import { WebSocketServer, type WebSocket } from 'ws'

export const createDevServer = (
  port: number,
  outDir: string
): (() => WebSocket | null) => {
  const mimeType: Record<string, string> = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/x-font-ttf'
  }

  const server = http.createServer(async (req, res) => {
    // console.log(`${req.method} ${req.url}`)
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
      res.setHeader('Content-type', mimeType[ext] || 'text/plain')
      res.end(content)
    } catch (e) {
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
