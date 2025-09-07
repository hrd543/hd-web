import {
  defaultSharedConfig,
  mergeConfig,
  SharedConfig
} from '../config/index.js'

export type DevConfig = SharedConfig & {
  /** The port to serve the application */
  port: number
  /**
   * Some node_modules should be transformed in order to build the
   * site, for example those containing css imports.
   *
   * `@hd-web/components` is always included by default.
   */
  dependenciesToTransform: string[]
}

const defaultBuildSiteConfig: DevConfig = {
  ...defaultSharedConfig,
  dependenciesToTransform: [],
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
