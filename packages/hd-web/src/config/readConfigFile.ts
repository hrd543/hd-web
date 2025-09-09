import path from 'path'
import url from 'url'

import { HdError } from '../errors/index.js'
import { SharedConfig } from './sharedConfig.js'

export const readConfigFile = async <Dev, Build>(): Promise<
  Partial<{
    shared: Partial<SharedConfig>
    dev: Partial<Dev>
    build: Partial<Build>
  }>
> => {
  const configFile = path.join(process.cwd(), 'hd.config.js')

  try {
    const file = await import(
      /* @vite-ignore */ url.pathToFileURL(configFile).href
    )

    return file.default
  } catch {
    throw new HdError('fs.missingConfig')
  }
}
