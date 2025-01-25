import http from 'http'
import path from 'path'
import { WebSocketServer, type WebSocket } from 'ws'
import { mimeTypes } from './mimeTypes.js'

type FileSystem = {
  exists: (file: string) => boolean | Promise<boolean>
  read: (file: string) => any | Promise<any>
}

const getFilename = async (pathname: string, filesystem: FileSystem) => {
  // If the path represents a flie, return it
  if (await filesystem.exists(pathname)) {
    return pathname
  }

  // Otherwise, check for "x.html" and then "x/index.html"
  const filename = `${pathname.replace(/[\\/]$/, '')}.html`
  if (await filesystem.exists(filename)) {
    return filename
  }

  return path.join(pathname, 'index.html')
}

/**
 * Create a simple dev server. Don't use in production.
 * @param port The port at which the server will be used
 * @param filesystem Provide methods for reading and checking existence of a file.
 * This could be the actual file system, or some sort of in memory version.
 * @param filename404 The name of the 404 page, if any
 * @returns A getter for a simple websocket server which may be used (among other things)
 * to refresh the page
 */
export const createDevServer = (
  port: number,
  filesystem: FileSystem,
  filename404 = '404.html'
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

    const filename = await getFilename(pathname, filesystem)
    const content = await filesystem.read(filename)

    if (!content) {
      res.statusCode = 404
      // Check for any 404 page in this directory, otherwise use relative to root
      const relative404 = path.join(path.dirname(filename), filename404)
      const page404 = filesystem.exists(relative404) ? relative404 : filename404

      if (filesystem.exists(page404)) {
        res.setHeader('Content-type', mimeTypes['.html'] || 'text/plain')
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
