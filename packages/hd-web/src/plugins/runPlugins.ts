import { HdError } from '../errors/HdError.js'
import { HdBuildEndResult, HdPlugin } from './types.js'

export const runPlugins = async <T>(
  config: T,
  plugins: Array<HdPlugin<T>>,
  type: 'start' | 'end'
): Promise<Array<HdBuildEndResult>> => {
  const method = type === 'start' ? 'onBuildStart' : 'onBuildEnd'
  const results: Array<HdBuildEndResult | void> = []

  for (const plugin of plugins) {
    try {
      results.push(await plugin[method]?.(config))
    } catch (e) {
      throw new HdError('plugin.error', plugin.name, method, e)
    }
  }

  return results.filter((x): x is HdBuildEndResult => Boolean(x))
}
