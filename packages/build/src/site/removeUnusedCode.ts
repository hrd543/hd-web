import * as esbuild from 'esbuild'

export const removeUnusedCode = async (
  file: string,
  defaultConfig?: esbuild.BuildOptions
) => {
  await esbuild.build({
    ...defaultConfig,
    entryPoints: [file],
    outfile: file,
    allowOverwrite: true,
    minify: true,
    format: 'iife'
  })
}
