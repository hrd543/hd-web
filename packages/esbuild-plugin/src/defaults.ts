import * as esbuild from 'esbuild'

/** A set of esbuild options which are good defaults */
export const defaultEsbuildOptions: esbuild.BuildOptions = {
  format: 'esm',
  assetNames: '[name]-[hash]',
  loader: {
    '.jpg': 'file',
    '.webp': 'file',
    '.png': 'file',
    '.woff2': 'file'
  }
}
