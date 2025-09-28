import { HdError } from '../errors/HdError.js'
import { BuildEndResult, Plugin } from './types.js'

export const runPlugins = async <T>(
  config: T,
  plugins: Array<Plugin<T>>,
  type: 'start' | 'end'
): Promise<Array<BuildEndResult>> => {
  const method = type === 'start' ? 'onBuildStart' : 'onBuildEnd'
  const results: Array<BuildEndResult | void> = []

  for (const plugin of plugins) {
    try {
      results.push(await plugin[method]?.(config))
    } catch (e) {
      throw new HdError('plugin.error', plugin.name, method, e)
    }
  }

  return results.filter((x): x is BuildEndResult => Boolean(x))
}
