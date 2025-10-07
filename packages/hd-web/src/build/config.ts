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
  /** The type of the build */
  type: 'build'
}

const defaultBuildSiteConfig: BuildConfig = {
  ...defaultSharedConfig,
  out: 'build',
  target: 'ES6',
  type: 'build'
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (
  rawConfig: Partial<BuildConfig>
): BuildConfig => {
  return {
    ...mergeConfig(rawConfig, defaultBuildSiteConfig),
    type: 'build' as const
  }
}
