import { HdError } from '../errors/HdError.js'
import { HdPlugin } from './types.js'

export const applyPluginsToConfig = <T>(
  initial: T,
  plugins: Array<HdPlugin<T>>
): T =>
  plugins.reduce((modified, p) => {
    try {
      return p.modifyConfig?.(modified) ?? modified
    } catch (e) {
      throw new HdError('plugin.error', p.name, 'modifyConfig', e)
    }
  }, initial)
