import { defaultEsbuildOptions, hdWebPlugin } from '@hd-web/esbuild-plugin'
import * as esbuild from 'esbuild'

const ctx = await esbuild.context({
  ...defaultEsbuildOptions,
  target: 'esnext',
  plugins: [hdWebPlugin({ entry: './App2.tsx', out: 'www', dev: true })]
})

await ctx.serve({
  servedir: 'www',
  port: 8080
})

process.on('SIGINT', async () => {
  await ctx.dispose()
})

// TODO process decorators in dev mode.
