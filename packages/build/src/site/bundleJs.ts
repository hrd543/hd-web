import * as esbuild from 'esbuild'
import { defaultConfig } from '../shared/constants.js'

export const bundleFirstPass = (entry: string, out: string) =>
  esbuild.build({
    ...defaultConfig,
    entryPoints: [entry],
    outfile: out,
    // don't minify on the first pass to save time
    minify: false,
    // Use esm to preserve imports
    format: 'esm'
  })

export const bundleFinalPass = async (file: string) => {
  await esbuild.build({
    ...defaultConfig,
    entryPoints: [file],
    outfile: file,
    allowOverwrite: true,
    minify: true,
    format: 'iife'
  })
}
