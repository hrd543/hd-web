import url from 'url'
import fs from 'fs/promises'
import { createRequire } from 'module'

export const clearRequireCache = (req: NodeJS.Require, entry: string) => {
  // TODO fix this
  delete req.cache[entry.slice(8).replaceAll('/', '\\')]
}

export const importSite = async (entry: string) => {
  // We need the site to be interpreted as ts for decorators.
  const entryTs = entry.replace('.js', '.ts')
  await fs.rename(entry, entryTs)

  const req = createRequire(import.meta.url)
  const importPath = url.pathToFileURL(entryTs).href
  clearRequireCache(req, importPath)
  const site = req(importPath).default

  await fs.rename(entryTs, entry)

  return site
}
