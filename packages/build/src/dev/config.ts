import { mergeConfig } from '../shared/mergeConfig.js'

export type BuildDevConfig = {
  /** The directory, relative to cwd, containing the pages */
  entryDir: string
  /** The filename of each page in entryDir, where the html generator is exported */
  pageFilename: string
  /** The port for the dev server */
  port: number
}

const defaultBuildDevConfig: BuildDevConfig = {
  entryDir: 'src',
  pageFilename: 'index.tsx',
  port: 8080
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<BuildDevConfig>) => {
  const config = mergeConfig(rawConfig, defaultBuildDevConfig)

  return config
}
