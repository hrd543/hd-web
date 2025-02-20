import { BuildSiteConfig } from './config.js'

/**
 * Modify the build process to conform to specific providers'
 * build implementations.
 */
export type Adapter = {
  /** Run before build, returns a modified config */
  before?: (
    config: BuildSiteConfig
  ) => Promise<BuildSiteConfig | void> | BuildSiteConfig | void
  /** Run after build */
  after?: (out: BuildSiteConfig) => Promise<void> | void
}

/**
 * Run the before methods on each of the adapters in sequence
 * to obtain a new config (which may be unchanged.)
 */
export const runBeforeAdapters = async (
  initialConfig: BuildSiteConfig,
  adapters: Adapter[] | undefined
) => {
  if (!adapters) {
    return initialConfig
  }

  let config = { ...initialConfig }

  for (const adapter of adapters) {
    if (adapter?.before) {
      config = (await adapter.before(config)) ?? config
    }
  }

  return config
}

/**
 * Run the after methods on each of the adapters in sequence.
 */
export const runAfterAdapters = async (
  config: BuildSiteConfig,
  adapters: Adapter[] | undefined
) => {
  if (!adapters) {
    return
  }

  for (const adapter of adapters) {
    await adapter.after?.(config)
  }
}
