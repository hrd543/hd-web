import path from 'path'
import url from 'url'

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
    console.warn(`No config file found at ${configFile}. Using default options`)

    return {}
  }
}
