import { readConfigFile } from '../config/index.js'
import { DevConfig } from './config.js'
import { dev } from './dev.js'

export const devScript = async () => {
  const config = await readConfigFile<DevConfig, unknown>()

  return dev({ ...config.shared, ...config.dev })
}
