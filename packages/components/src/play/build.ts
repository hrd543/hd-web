import { defaultEsbuildOptions, hdWebPlugin } from '@hd-web/esbuild-plugin'
import * as esbuild from 'esbuild'

await esbuild.build({
  ...defaultEsbuildOptions,
  minify: true,
  bundle: true,
  plugins: [hdWebPlugin({ entry: './App2.tsx', out: 'build2' })]
})
