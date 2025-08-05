import { createRequire } from 'module'
import url from 'url'
import path from 'path'

export const importSite = async (entry: string) => {
  const req = createRequire(import.meta.url)
  clearRequireCache(req, entry)

  return req(url.pathToFileURL(entry).href).default
}

export const clearRequireCache = (require: NodeJS.Require, entry: string) => {
  const fullPath = path.resolve(process.cwd(), entry)
  const folder = path.dirname(fullPath)

  for (const key in require.cache) {
    if (key.startsWith(folder)) {
      delete require.cache[key]
    }
  }
}
