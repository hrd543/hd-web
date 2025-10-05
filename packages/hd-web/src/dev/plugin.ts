import * as esbuild from 'esbuild'
import fs from 'fs/promises'

import { clientFileRegex } from '../stringify/index.js'
import { addFileToClass } from '../utils/index.js'

export const plugin = (): esbuild.Plugin => ({
  name: 'hd-web-plugin',
  setup(build) {
    // TODO investigate whether this is needed in dev too
    build.onLoad({ filter: clientFileRegex }, async (args) => {
      const code = await fs.readFile(args.path, { encoding: 'utf-8' })

      return {
        contents: addFileToClass(code, args.path.replaceAll('\\', '/')),
        loader: 'jsx'
      }
    })
  }
})
