import * as esbuild from 'esbuild'

import { HdError, isEsbuildError } from '../errors/index.js'
import { BuildConfig } from './config.js'
import { plugin } from './plugin.js'
import { getFileLoaders } from './utils.js'
import { Plugin } from '../plugins/types.js'

const getSharedEsbuildOptions = ({
  target,
  fileTypes,
  write
}: BuildConfig): esbuild.BuildOptions => ({
  minify: true,
  bundle: true,
  treeShaking: true,
  globalName: 'site',
  target,
  write,
  publicPath: '/',
  loader: getFileLoaders(fileTypes),
  logLevel: 'silent'
})

export const runEsbuildFirst = async (
  config: BuildConfig,
  plugins: Array<Plugin<BuildConfig>>
) => {
  try {
    return await esbuild.build({
      ...getSharedEsbuildOptions(config),
      plugins: [plugin(plugins, config)],
      platform: 'node',
      entryPoints: [config.entry],
      outdir: config.out,
      metafile: true,
      format: config.write ? 'esm' : 'iife',
      // Ignore any hd-web dependencies.
      external: ['esbuild', 'express']
    })
  } catch (e: unknown) {
    if (!isEsbuildError(e)) {
      throw e
    }

    throw new HdError('fs.fileType', e.message)
  }
}

const defaultExportRegex =
  /No matching export in "[^"]+\.client.ts" for import "default"/

export const runEsbuildLast = async (
  config: BuildConfig,
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
