import * as esbuild from 'esbuild'

import { HdError, isEsbuildError } from '../errors/index.js'
import { buildSite, getSiteInMemory } from '../shared/index.js'
import { DevConfig } from './config.js'
import { DevRebuild } from './types.js'
import { plugin } from './plugin.js'
import {
  convertToEsbuildPlugin,
  Plugin,
  runPluginCallbacks
} from '../plugins/index.js'

export const getDevRebuildCallback = async (
  config: DevConfig,
  plugins: Plugin<DevConfig>[]
): Promise<() => Promise<DevRebuild>> => {
  const context = await esbuild.context({
    ...getEsbuildOptions(),
    plugins: [...plugins.map(convertToEsbuildPlugin(config)), plugin()],
    entryPoints: [config.entry]
  })

  return async () => {
    try {
      await runPluginCallbacks(config, plugins, 'onSiteStart')

      const before = performance.now()
      const { outputFiles } = await context.rebuild()
      const jsFile = outputFiles!.find((f) => f.path.endsWith('.js'))!
      const css = outputFiles!.find((f) => f.path.endsWith('.css'))!.text
      const site = await buildSite(await getSiteInMemory(jsFile.text), config)

      await runPluginCallbacks(config, plugins, 'onSiteEnd')

      console.log('Hd-web rebuilt in ', performance.now() - before, 'ms')

      return {
        site,
        css
      }
    } catch (e: unknown) {
      if (!isEsbuildError(e)) {
        throw e
      }

      throw new HdError('fs.fileType', e.message)
    }
  }
}

const getEsbuildOptions = (): esbuild.BuildOptions => ({
  platform: 'node',
  outdir: 'www',
  metafile: true,
  format: 'esm',
  // Ignore any hd-web dependencies.
  external: ['esbuild', 'express'],
  // Minifying for now to help the text import below
  minify: true,
  bundle: true,
  target: 'esnext',
  write: false,
  publicPath: '/',
  logLevel: 'silent'
})
