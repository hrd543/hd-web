import * as esbuild from 'esbuild'
import { hdWebPlugin, defaultEsbuildOptions } from '@hd-web/esbuild-plugin'
import App from './src/index'

// This file is run when building your site. These options dictate
// where your files come from and will be built.
// Try running npm run build and look inside the build folder.
const ctx = await esbuild.context({
  ...defaultEsbuildOptions,
  bundle: true,
  target: 'esnext',
  plugins: [hdWebPlugin(App, { out: 'www' })]
})

await ctx.watch()

await ctx.serve({
  servedir: 'www'
})
