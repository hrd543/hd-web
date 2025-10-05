import * as esbuild from 'esbuild'

import { HdError, isEsbuildError } from '../errors/index.js'
import { plugin } from './plugin.js'
import { getFileLoaders } from './utils.js'
import { Plugin } from '../plugins/types.js'
import { DevConfig } from './config.js'

const getSharedEsbuildOptions = ({
  fileTypes
}: DevConfig): esbuild.BuildOptions => ({
  minify: false,
  bundle: true,
  globalName: 'site',
  target: 'esnext',
  write: false,
  publicPath: '/',
  loader: getFileLoaders(fileTypes),
  logLevel: 'silent'
})

export const getEsbuildContext = async (
  config: DevConfig,
  plugins: Array<Plugin<DevConfig>>
) => {
  return await esbuild.context({
    ...getSharedEsbuildOptions(config),
    plugins: [plugin(plugins, config)],
    platform: 'node',
    entryPoints: [config.entry],
    outdir: 'www',
    metafile: true,
    format: config.write ? 'esm' : 'iife',
    // Ignore any hd-web dependencies.
    external: ['esbuild', 'express']
  })
}

const defaultExportRegex =
  /No matching export in "[^"]+\.client.ts" for import "default"/

export const runEsbuildLast = async (
  config: DevConfig,
  outfile: string,
  js: string
) => {
  if (!js) {
    return
  }

  try {
    return await esbuild.build({
      ...getSharedEsbuildOptions(config),
      stdin: { contents: js, loader: 'js', resolveDir: '.' },
      outfile,
      platform: 'browser',
      allowOverwrite: true,
      format: 'esm'
    })
  } catch (e: unknown) {
    if (!isEsbuildError(e)) {
      throw e
    }

    const reason = e.errors[0]!.text

    if (defaultExportRegex.test(reason)) {
      throw new HdError('comp.defaultExport', reason)
    } else {
      throw e
    }
  }
}
