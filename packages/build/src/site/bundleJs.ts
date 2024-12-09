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
    metafile: true
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
