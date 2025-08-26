import { SharedConfig } from './sharedConfig.js'
import url from 'url'
import path from 'path'

export const readConfigFile = async <Dev, Build>(): Promise<{
  shared: SharedConfig
  dev: Dev
  build: Build
}> => {
  return (
    await import(
      url.pathToFileURL(path.join(process.cwd(), 'hd.config.js')).href
    )
  ).default()
}
