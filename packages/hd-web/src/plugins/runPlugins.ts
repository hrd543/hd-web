import { HdError } from '../errors/HdError.js'
import { HdPlugin } from './types.js'

export const runPlugins = async <T>(
  config: T,
  plugins: Array<HdPlugin<T>>,
  type: 'start' | 'end'
) => {
  const method = type === 'start' ? 'onBuildStart' : 'onBuildEnd'

  for (const plugin of plugins) {
    try {
      await plugin[method]?.(config)
    } catch (e) {
      throw new HdError('plugin.error', plugin.name, method, e)
    }
  }
}
