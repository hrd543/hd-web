import {
  defaultSharedConfig,
  mergeConfig,
  SharedConfig
} from '../config/index.js'

export type DevConfig = SharedConfig & {
  /** The port to serve the application */
  port: number
}

const defaultBuildSiteConfig: DevConfig = {
  ...defaultSharedConfig,
  port: 8080
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<DevConfig>) => {
  const config = mergeConfig(rawConfig, defaultBuildSiteConfig)

  return config
}
