import { HdPlugin } from '../plugins/types.js'
import { DevConfig } from './config.js'
import * as vite from 'vite'

export const devPlugin = (plugins: Array<HdPlugin<DevConfig>>): vite.Plugin => {
  return {
    name: 'hd-plugin',
    // Currently the first plugin which matches will take precedence
    async load(id) {
      for (const plugin of plugins) {
        if (plugin.onLoad && plugin.onLoad.filter.test(id)) {
          return (await plugin.onLoad.load({ path: id })).contents
        }
      }
    }
  }
}
