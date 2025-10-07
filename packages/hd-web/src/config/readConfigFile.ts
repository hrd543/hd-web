import path from 'path'
import url from 'url'

import { HdError } from '../errors/index.js'
import { WithPlugins } from './config.js'

export const readConfigFile = async <Dev, Build>(): Promise<
  WithPlugins<Partial<Dev & Build>>
> => {
  const configFile = path.join(process.cwd(), 'hd.config.js')

  try {
    const file = await import(url.pathToFileURL(configFile).href)

    return file.default
  } catch {
    throw new HdError('fs.missingConfig')
  }
}
