import { mergeConfig } from '../shared/mergeConfig.js'

export type BuildSiteConfig = {
  /** The folder containing any static files, like a favicon */
  staticFolder?: string
  /** The language of your site, defaults to British English "en-GB" */
  lang: string
  /** Should the titles be joined */
  joinTitles: boolean
}

const defaultBuildSiteConfig: BuildSiteConfig = {
  lang: 'en-GB',
  joinTitles: true
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<BuildSiteConfig>) => {
  const config = mergeConfig(rawConfig, defaultBuildSiteConfig)

  return config
}
