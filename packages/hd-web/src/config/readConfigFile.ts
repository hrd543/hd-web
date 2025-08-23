import { SharedConfig } from './sharedConfig.js'
import fs from 'fs/promises'
import path from 'path'

export const readConfigFile = async <Dev, Build>(): Promise<{
  shared: SharedConfig
  dev: Dev
  build: Build
}> => {
  const configRaw = await fs.readFile(
    path.join(process.cwd(), 'hd.config.json'),
    { encoding: 'utf-8' }
  )

  return JSON.parse(configRaw)
}
