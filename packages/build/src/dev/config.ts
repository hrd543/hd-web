import { mergeConfig } from '../shared/mergeConfig.js'

export type BuildDevConfig = {
  /** The file, relative to cwd, containing the pages */
  entry: string
  /** The port for the dev server */
  port: number
  /** The folder, relative to cwd, containing static assets */
  staticFolder?: string
}

const defaultBuildDevConfig: BuildDevConfig = {
  entry: 'src/index.tsx',
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
