import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import { addFileToClass } from './addFileToClass.js'
import { clientFileRegex } from '../stringify/index.js'

export const plugin = (): esbuild.Plugin => ({
  name: 'hd-web-plugin',
  setup(build) {
    build.onLoad({ filter: clientFileRegex }, async (args) => {
      const code = await fs.readFile(args.path, { encoding: 'utf-8' })

      return {
        contents: addFileToClass(code, args.path.replaceAll('\\', '/')),
        loader: 'jsx'
      }
    })
  }
})
