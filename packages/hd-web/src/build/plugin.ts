import * as esbuild from 'esbuild'
import fs from 'fs/promises'

import { clientFileRegex } from '../stringify/index.js'
import { addFileToClass } from '../utils/index.js'
import { HdPlugin } from '../plugins/types.js'
import { BuildConfig } from './config.js'
import { HdError } from '../errors/HdError.js'

export const plugin = (
  plugins: Array<HdPlugin<BuildConfig>>
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

    plugins.forEach(({ onLoad, name }) => {
      if (onLoad) {
        build.onLoad({ filter: onLoad.filter }, async (args) => {
          try {
            return await onLoad.load(args)
          } catch (e) {
            throw new HdError('plugin.error', name, 'onLoad', e)
          }
        })
      }
    })
  }
})
