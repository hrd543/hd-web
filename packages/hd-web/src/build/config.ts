import {
  mergeConfig,
  defaultSharedConfig,
  SharedConfig
} from '../shared/index.js'

export type BuildConfig = SharedConfig & {
  /** The folder containing any static files, like a favicon */
  staticFolder?: string
  /** The folder in which to place the built files */
  out: string
  /** The target to build for, defaults to ES6 */
  target: string
}

const defaultBuildSiteConfig: BuildConfig = {
  ...defaultSharedConfig,
  out: 'build',
  target: 'ES6'
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<BuildConfig>) => {
  return mergeConfig(rawConfig, defaultBuildSiteConfig)
}
