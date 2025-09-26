import { HdError } from '../errors/HdError.js'
import { HdPlugin } from '../plugins/types.js'
import { DevConfig } from './config.js'
import * as vite from 'vite'

export const devPlugin = (
  plugins: Array<HdPlugin<DevConfig>>,
  config: DevConfig
): vite.Plugin => {
  return {
    name: 'hd-plugin',
    // Currently the first plugin which matches will take precedence
    async load(id) {
      for (const plugin of plugins) {
        if (plugin.onLoad && plugin.onLoad.filter.test(id)) {
          try {
            return (await plugin.onLoad.load({ path: id, config })).contents
          } catch (e) {
            throw new HdError('plugin.error', plugin.name, 'onLoad', e)
          }
        }
      }
    }
  }
}
