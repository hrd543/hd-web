import type { HdBuildConfig } from '../build/index.js'
import type { HdDevConfig } from '../dev/index.js'
import { HdPlugin } from '../plugins/index.js'

export type WithPlugins<T> = T & {
  /** Plugins to extend hd-web's functionality */
  plugins: Array<HdPlugin<T>>
}

export type HdSiteConfig = WithPlugins<HdBuildConfig & HdDevConfig>

export const defineHdConfig = (config?: Partial<HdSiteConfig>) => config
