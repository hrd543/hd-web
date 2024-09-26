import { mergeConfig } from '../shared/mergeConfig.js'

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

/**
 * Replace all missing / undefined keys with the defaults, and validate
 * the config for any potential issues.
 */
export const validateConfig = (rawConfig: Partial<BuildSiteConfig>) => {
  const config = mergeConfig(rawConfig, defaultBuildSiteConfig)

  if (config.entryDir === config.outDir) {
    throw new Error("Can't have input the same as output")
  }

  return config
}
