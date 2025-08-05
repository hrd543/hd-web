import { defaultEsbuildOptions, hdWebPlugin } from '@hd-web/esbuild-plugin'
import * as esbuild from 'esbuild'

// This file is run when building your site. These options dictate
// where your files come from and will be built.
// Try running npm run build and look inside the build folder.

const ctx = await esbuild.context({
  ...defaultEsbuildOptions,
  target: 'esnext',
  plugins: [hdWebPlugin({ out: 'www', dev: true })]
})

await ctx.serve({
  servedir: 'www',
  port: 8080
})

process.on('SIGINT', async () => {
  await ctx.dispose()
})
