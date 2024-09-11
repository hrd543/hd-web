export type BuildSiteConfig = {
  /** The directory, relative to cwd, containing the pages */
  entryDir: string
  /** The directory, relative to cwd, in which the site will be built */
  outDir: string
  /** The filename of each page in entryDir, where the html generator is exported */
  pageFilename: string
}

export const defaultBuildSiteConfig: BuildSiteConfig = {
  entryDir: 'src',
  outDir: 'build',
  pageFilename: 'index.tsx'
}

const merge = (
  partial: Partial<BuildSiteConfig>,
  defaults: BuildSiteConfig
): BuildSiteConfig => {
  // First remove all undefineds since otherwise they'll
  // overwrite
  const partialCopy = { ...partial }
  for (const rawKey in partialCopy) {
    const key = rawKey as keyof BuildSiteConfig
    if (partialCopy[key] === undefined) {
      delete partialCopy[key]
    }
  }

  return {
    ...defaults,
    ...partialCopy
  }
}

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<BuildSiteConfig>) => {
  const config = merge(rawConfig, defaultBuildSiteConfig)

  if (config.entryDir === config.outDir) {
    throw new Error("Can't have input the same as output")
  }

  return config
}
