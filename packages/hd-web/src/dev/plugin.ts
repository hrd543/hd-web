import * as esbuild from 'esbuild'
import fs from 'fs/promises'
import nodePath from 'path'

import { clientFileRegex } from '../stringify/index.js'
import { addFileToClass } from '../utils/index.js'

const buildFileTypeRegex = (fileTypes: string[]): RegExp => {
  const fileTypeOr = fileTypes.map((x) => x.slice(1)).join('|')

  return new RegExp(`\\.(${fileTypeOr})$`)
}

export const plugin = (): esbuild.Plugin => ({
  name: 'hd-web-plugin',
  setup(build) {
    // These are the file types which use a file loader
    // In dev mode, we don't copy anything, and just reference the original
    const fileTypes = Object.entries(build.initialOptions.loader ?? {})
      .filter(([, type]) => type === 'file')
      .map(([f]) => f)

    // Don't copy images over and reference them relative to cwd
    build.onLoad(
      { filter: buildFileTypeRegex(fileTypes) },
      async ({ path }) => {
        const relativePath = nodePath
          .relative(process.cwd(), path)
          .replaceAll('\\', '/')

        return {
          contents: `export default "/${relativePath}"`
        }
      }
    )

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
