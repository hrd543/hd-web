import * as esbuild from 'esbuild'
import fs from 'fs/promises'

import { clientFileRegex } from '../stringify/index.js'
import { addFileToClass } from '../utils/index.js'
import { Plugin } from '../plugins/types.js'
import { BuildConfig } from './config.js'
import { HdError } from '../errors/HdError.js'
import { HdBuildConfig } from './index.js'

export const plugin = (
  plugins: Array<Plugin<BuildConfig>>,
  config: HdBuildConfig
): esbuild.Plugin => ({
  name: 'hd-web-plugin',
  setup(build) {
    build.onLoad({ filter: clientFileRegex }, async (args) => {
      const code = await fs.readFile(args.path, { encoding: 'utf-8' })

      return {
        contents: addFileToClass(code, args.path.replaceAll('\\', '/')),
        loader: 'jsx'
      }
    })

    build.onResolve

    plugins.forEach(({ onLoad, name, onResolve }) => {
      if (onLoad) {
        build.onLoad({ filter: onLoad.filter }, async (args) => {
          try {
            return await onLoad.load({ ...args, config })
          } catch (e) {
            throw new HdError('plugin.error', name, 'onLoad', e)
          }
        })
      }

      if (onResolve) {
        build.onResolve({ filter: onResolve.filter }, async (args) => {
          try {
            const type =
              args.kind === 'import-rule' ||
              args.kind === 'composes-from' ||
              args.kind === 'url-token'
                ? 'css'
                : 'js'

            return (
              (await onResolve.resolve({ ...args, type, config })) ?? undefined
            )
          } catch (e) {
            throw new HdError('plugin.error', name, 'onResolve', e)
          }
        })
      }
    })
  }
})
