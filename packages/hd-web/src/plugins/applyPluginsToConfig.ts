import { HdPlugin } from './types.js'

export const applyPluginsToConfig = <T>(
  initial: T,
  plugins: Array<HdPlugin<T>>
): T =>
  plugins.reduce(
    (modified, p) => p.modifyConfig?.(modified) ?? modified,
    initial
  )
