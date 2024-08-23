import * as esbuild from 'esbuild'

export const removeUnusedCode = async (
  file: string,
  defaultConfig?: esbuild.BuildOptions
) => {
  // Our first pass removes top level unused code.
  // We need to keep it as esm since we will do a second pass
  // to remove unused code nested within functions.
  // E.g. only B is removed in the first pass.
  // const A = () => 2
  // const B = () => A
  await esbuild.build({
    ...defaultConfig,
    entryPoints: [file],
    outfile: file,
    allowOverwrite: true,
    minify: true,
    format: 'iife'
  })
}
