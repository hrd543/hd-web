import type { HdBuildConfig } from '../build/index.js'
import type { HdDevConfig } from '../dev/index.js'
import { Plugin } from '../plugins/index.js'

export type HdSiteConfig = WithPlugins<HdBuildConfig & HdDevConfig>

export type WithPlugins<T> = T & {
  plugins?: Plugin<T>[]
}

export const defineHdConfig = (config?: Partial<HdSiteConfig>) => config
