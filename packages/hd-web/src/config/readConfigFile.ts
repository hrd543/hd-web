import path from 'path'
import url from 'url'

import { SharedConfig } from './sharedConfig.js'

export const readConfigFile = async <Dev, Build>(): Promise<{
  shared: SharedConfig
  dev: Dev
  build: Build
}> => {
  return (
    await import(
      /* @vite-ignore */ url.pathToFileURL(
        path.join(process.cwd(), 'hd.config.js')
      ).href
    )
  ).default
}
