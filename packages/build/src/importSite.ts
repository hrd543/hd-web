import url from 'url'
import fs from 'fs/promises'

export const importSite = async (entry: string) => {
  // We need the site to be interpreted as ts for decorators.
  const entryTs = entry.replace('.js', '.ts')
  await fs.rename(entry, entryTs)

  const site = (await import(url.pathToFileURL(entry).href)).default

  await fs.rename(entryTs, entry)

  return site
}
