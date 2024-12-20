import fs from 'fs/promises'
import path from 'path'
import { assetFolder } from '../shared/constants.js'
import * as esbuild from 'esbuild'

/**
 * If splitting is enabled, then use this plugin to inline
 * dynamic imports for files matching the given regex, rather
 * than separating them into a separate bundle.
 *
 * Uses the same logic as file loader such that the file is copied
 * into out, and a js file default exports the file location.
 *
 * Will place import scripts into a folder named assets within
 * out, so that they can then be deleted if needed.
 */
export const inlineDynamicImportsPlugin = (
  regex: RegExp,
  out: string
): esbuild.Plugin => ({
  name: 'inline-dynamic-imports',
  setup(build) {
    let index = 0

    build.onResolve({ filter: regex }, async (args) => {
      if (args.kind === 'dynamic-import') {
        // Make the assets dir within build so that it can be deleted once done.
        if (index === 0) {
          await fs.mkdir(path.join(out, assetFolder))
        }

        // This should use a better hashing so we can cache it
        const { name, ext } = path.parse(args.path)
        const filename = `${name}-${index++}`
        const asset = `${filename}${ext}`
        const js = `${filename}.js`

        // Copy the image into the build folder
        await fs.copyFile(
          path.join(args.resolveDir, args.path),
          path.join(out, asset)
        )

        // Write a simple js file to export the image location (within assets)
        await fs.writeFile(
          path.join(out, assetFolder, js),
          `export default './${asset}'`
        )

        // Return the path to the newly created js, and make external
        // to avoid code splitting
        return { path: `./${assetFolder}/${js}`, external: true }
      }
    })
  }
})
