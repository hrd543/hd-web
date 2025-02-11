import { mergeConfig } from '../shared/mergeConfig.js'

export type BuildDevConfig = {
  /** The file, relative to cwd, containing the pages */
  entry: string
  /** The port for the dev server */
  port: number
  /** The language of your site, defaults to British English "en-GB" */
  lang: string
  /** Should the titles be joined */
  joinTitles: boolean
}

const defaultBuildDevConfig: BuildDevConfig = {
  entry: 'src/index.tsx',
  port: 8080,
  lang: 'en-GB',
  joinTitles: true
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<BuildDevConfig>) => {
  const config = mergeConfig(rawConfig, defaultBuildDevConfig)

  return config
}
