import { HdError } from '../errors/HdError.js'
import { Plugin } from './types.js'

export const runPluginCallbacks = async <T>(
  config: T,
  plugins: Array<Plugin<T>>,
  method:
    | 'onSiteStart'
    | 'onSiteEnd'
    | 'onPageStart'
    | 'onPageEnd'
    | 'onStart'
    | 'onEnd'
): Promise<void> => {
  for (const plugin of plugins) {
    try {
      await plugin[method]?.(config)
    } catch (e) {
      throw new HdError('plugin.error', plugin.name, method, e)
    }
  }
}
