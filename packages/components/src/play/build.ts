import { defaultEsbuildOptions, hdWebPlugin } from '@hd-web/esbuild-plugin'
import * as esbuild from 'esbuild'
import A from './App2.js'

await esbuild.build({
  ...defaultEsbuildOptions,
  minify: true,
  bundle: true,
  plugins: [hdWebPlugin(A, { out: 'build2' })]
})
