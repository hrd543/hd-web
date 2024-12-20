import * as esbuild from 'esbuild'
import path from 'path'
import { assetExts, assetFolder, defaultConfig } from '../shared/constants.js'
import fs from 'fs/promises'

export type BuiltFile = {
  path: string
  relativePath: string
  type: string
  isEntry?: true
}

const assetRegex = new RegExp(`.*\\.(${assetExts.join('|')})$`)
console.log(assetRegex)

export const bundleFirstPass = async (entry: string, out: string) => {
  let index = 0

  const { metafile } = await esbuild.build({
    ...defaultConfig,
    entryPoints: [entry],
    outdir: out,
    // Split so that async imports are separated
    splitting: true,
    minify: true,
    // Use esm to preserve imports and enable splitting
    format: 'esm',
    // Needed to get the names of the files with any hashes.
    metafile: true,
    // The first pass is run in node
    platform: 'node',
    plugins: [
      {
        name: 'dynamic-import-assets',
        setup(build) {
          build.onResolve({ filter: assetRegex }, async (args) => {
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
      }
    ]
  })

  return Object.entries(metafile.outputs).reduce((all, [file, output]) => {
    const builtFile: BuiltFile = {
      path: file,
      relativePath: path.relative(out, file),
      type: path.extname(file)
    }

    // This means the file is the main entry point
    if (output.entryPoint === entry) {
      builtFile.isEntry = true
    }

    all.push(builtFile)

    return all
  }, [] as BuiltFile[])
}

/**
 * Remove the unused code in the outFile by rebuilding
 */
export const bundleFinalPass = (outFile: string) =>
  esbuild.build({
    ...defaultConfig,
    // Don't bundle in this pass since we've already built,
    // We just want to remove the unused code for the entry point
    bundle: false,
    entryPoints: [outFile],
    outfile: outFile,
    format: 'esm',
    allowOverwrite: true,
    minify: true
  })
