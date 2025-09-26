import { HdPlugin } from './types.js'

export const runPlugins = async <T>(
  config: T,
  plugins: Array<HdPlugin<T>>,
  type: 'start' | 'end'
) => {
  const method = type === 'start' ? 'onBuildStart' : 'onBuildEnd'

  for (const plugin of plugins) {
    await plugin[method]?.(config)
  }
}
