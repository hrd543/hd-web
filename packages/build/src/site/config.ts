import { mergeConfig } from '../shared/mergeConfig.js'

export type BuildSiteConfig = {
  /** The file, relative to cwd, containing the pages */
  entry: string
  /** The directory, relative to cwd, in which the site will be built */
  out: string
}

const defaultBuildSiteConfig: BuildSiteConfig = {
  entry: 'src/index.tsx',
  out: 'build'
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<BuildSiteConfig>) => {
  const config = mergeConfig(rawConfig, defaultBuildSiteConfig)

  return config
}
