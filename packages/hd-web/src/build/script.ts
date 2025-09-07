import { readConfigFile } from '../config/index.js'
import { build } from './build.js'
import { BuildConfig } from './config.js'

export const buildScript = async () => {
  const config = await readConfigFile<unknown, BuildConfig>()

  return build({ ...config.build, ...config.shared })
}
