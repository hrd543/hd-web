import * as esbuild from 'esbuild'
import { defaultEsbuildOptions } from './defaults.js'
import { hdWebPlugin } from './index.js'
import { createDevServer, watch, getDiskFileSystem } from '@hd-web/dev-server'
import { BuildSiteConfig } from '@hd-web/build'
import path from 'path'

export const dev = async (config: Partial<BuildSiteConfig> = {}) => {
  const ctx = await esbuild.context({
    ...defaultEsbuildOptions,
    target: 'esnext',
    plugins: [hdWebPlugin({ ...config, out: 'www', dev: true })]
  })

  await ctx.rebuild()

  createDevServer(8080, getDiskFileSystem('www'))

  await watch(path.dirname(config.entry ?? ''), async () => {
    await ctx.rebuild()
  })

  process.on('SIGINT', async () => {
    await ctx.dispose()
  })
}
