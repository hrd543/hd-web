import * as esbuild from 'esbuild'
import { defaultEsbuildOptions } from './defaults.js'
import { hdWebPlugin } from './index.js'
import { BuildSiteConfig } from '@hd-web/build'

export const dev = async (config: Partial<BuildSiteConfig> = {}) => {
  const ctx = await esbuild.context({
    ...defaultEsbuildOptions,
    target: 'esnext',
    plugins: [hdWebPlugin({ ...config, out: 'www', dev: true })]
  })

  await ctx.serve({
    servedir: 'www',
    port: 8080
  })

  process.on('SIGINT', async () => {
    await ctx.dispose()
  })
}
