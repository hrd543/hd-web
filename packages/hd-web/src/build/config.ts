export type BuildSiteConfig = {
  /** The folder containing any static files, like a favicon */
  staticFolder?: string
  /** The language of your site, defaults to British English "en-GB" */
  lang: string
  /** Should the titles be joined */
  joinTitles: boolean
  /** The folder in which to place the built files */
  out: string
  /** The file which contains your App */
  entry: string
  /** Extra file types (including .) which should be included */
  fileTypes: string[]
  /** The target to build for, defaults to ES6 */
  target: string
}

const defaultBuildSiteConfig: BuildSiteConfig = {
  lang: 'en-GB',
  joinTitles: true,
  out: 'build',
  entry: 'src/index.tsx',
  fileTypes: [],
  target: 'ES6'
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
