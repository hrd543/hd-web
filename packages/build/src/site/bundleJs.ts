import * as esbuild from 'esbuild'
import path from 'path'
import { defaultConfig } from '../shared/constants.js'

export type BuiltFile = {
  path: string
  relativePath: string
  type: string
  isEntry?: true
}

export const bundleFirstPass = async (entry: string, out: string) => {
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
    platform: 'node'
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
export const bundleFinalPass = async (outFile: string) => {
  await esbuild.build({
    ...defaultConfig,
    // We don't want to actually bundle (hence everything is external)
    // However, we need it to be true so that it removes dead code.
    bundle: true,
    external: ['*'],
    entryPoints: [outFile],
    outfile: outFile,
    format: 'esm',
    allowOverwrite: true,
    minify: true
  })
}
