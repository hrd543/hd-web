import { HdError } from '../errors/HdError.js'
import { type Plugin } from '../plugins/index.js'
import { DevConfig } from './config.js'
import path from 'path'
import * as vite from 'vite'

export const devPlugin = (
  plugins: Array<Plugin<DevConfig>>,
  config: DevConfig
): vite.Plugin | null => {
  if (plugins.length === 0) {
    return null
  }

  return {
    name: 'hd-plugin',
    // This is the default for all hd-web plugins
    enforce: 'pre',

    // Currently the first plugin which matches will take precedence
    async load(id) {
      for (const plugin of plugins) {
        if (plugin.onLoad && plugin.onLoad.filter.test(id)) {
          try {
            return (
              await plugin.onLoad.load({
                path: id,
                config,
                buildType: 'dev'
              })
            ).contents
          } catch (e) {
            throw new HdError('plugin.error', plugin.name, 'onLoad', e)
          }
        }
      }
    },

    async resolveId(source, importer) {
      for (const plugin of plugins) {
        if (
          importer &&
          plugin.onResolve &&
          plugin.onResolve.filter.test(source)
        ) {
          try {
            const isCss = ['.css', '.scss', '.less', '.sass'].includes(
              path.extname(importer)
            )

            const result = await plugin.onResolve.resolve({
              path: source,
              type: isCss ? 'css' : 'js',
              importer,
              config,
              buildType: 'dev'
            })

            if (result && result.path) {
              return {
                id: result.path,
                external: result.external
              }
            }
          } catch (e) {
            throw new HdError('plugin.error', plugin.name, 'onResolve', e)
          }
        }
      }
    }
  }
}
