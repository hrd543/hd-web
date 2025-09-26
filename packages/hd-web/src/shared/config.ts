import type { HdBuildConfig } from '../build/index.js'
import type { SharedConfig } from '../config/index.js'
import type { HdDevConfig } from '../dev/index.js'

export type HdSiteConfig = {
  shared?: Partial<SharedConfig>
  build?: Partial<HdBuildConfig>
  dev?: Partial<HdDevConfig>
}

// Only to be used internally
export type DefinedHdSiteConfig = {
  shared: SharedConfig
  build: HdBuildConfig
  dev: HdDevConfig
}

export const defineHdConfig = (config?: HdSiteConfig) => config
