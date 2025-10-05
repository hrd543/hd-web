import * as esbuild from 'esbuild'
import { HdError, isEsbuildError } from '../errors/index.js'
import { buildSite } from '../shared/index.js'
import { DevConfig } from './config.js'
import { DevRebuild } from './types.js'
import { plugin } from './plugin.js'

export const getDevRebuildCallback = async (
  config: DevConfig
): Promise<() => Promise<DevRebuild>> => {
  const context = await esbuild.context({
    ...getEsbuildOptions(),
    plugins: [plugin(), ...config.plugins],
    entryPoints: [config.entry],
    loader: getFileLoaders(config.fileTypes)
  })

  return async () => {
    try {
      const before = performance.now()
      const { outputFiles } = await context.rebuild()
      const jsFile = outputFiles!.find((f) => f.path.endsWith('.js'))!
      const css = outputFiles!.find((f) => f.path.endsWith('.css'))!.text
      const site = await buildSite(getSiteInMemory(jsFile.text), config)

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
  format: 'iife',
  // Ignore any hd-web dependencies.
  external: ['esbuild', 'express'],
  minify: false,
  bundle: true,
  globalName: 'site',
  target: 'esnext',
  write: false,
  publicPath: '/',
  logLevel: 'silent'
})

const getSiteInMemory = (js: string) => {
  const f = new Function(`${js}; return site`)

  return f().default
}

// TODO use the shared version of this
const supportedFileTypes = ['.png', '.webp', '.woff2', '.jpg', '.jpeg']
const getFileLoaders = (extraFileTypes: string[]) =>
  [...supportedFileTypes, ...extraFileTypes].reduce(
    (all, type) => {
      all[type] = 'file'

      return all
    },
    {} as Record<string, 'file'>
  )
