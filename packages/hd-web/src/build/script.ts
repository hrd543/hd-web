import { readConfigFile } from '../config/index.js'
import { BuildConfig } from './config.js'
import { build } from './build.js'

export const buildScript = async () => {
  const config = await readConfigFile<unknown, BuildConfig>()

  return build({ ...config.shared, ...config.build })
}
