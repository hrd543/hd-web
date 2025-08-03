export type BuildSiteConfig = {
  /** Certain shortcuts can be taken if building for dev */
  dev: boolean
  /** The folder containing any static files, like a favicon */
  staticFolder?: string
  /** The language of your site, defaults to British English "en-GB" */
  lang: string
  /** Should the titles be joined */
  joinTitles: boolean
  /** The folder in which to place the built files */
  out: string
}

const defaultBuildSiteConfig: BuildSiteConfig = {
  lang: 'en-GB',
  joinTitles: true,
  dev: false,
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

const mergeConfig = <T extends Record<string, unknown>>(
  partial: Partial<T>,
  defaults: T
): T => {
  // First remove all undefineds since otherwise they'll
  // overwrite
  const partialCopy = { ...partial }
  for (const rawKey in partialCopy) {
    const key = rawKey as keyof T
    if (partialCopy[key] === undefined) {
      delete partialCopy[key]
    }
  }

  return {
    ...defaults,
    ...partialCopy
  }
}
