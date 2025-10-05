import type { HdBuildConfig } from '../build/index.js'
import type { HdDevConfig } from '../dev/index.js'

export type HdSiteConfig = HdBuildConfig & HdDevConfig

export const defineHdConfig = (config?: Partial<HdSiteConfig>) => config
