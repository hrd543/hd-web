import * as esbuild from 'esbuild'
import path from 'path'

import { getClientJs } from '../client/index.js'
import { buildPages } from '../shared/index.js'
import { buildReturnResult } from './builReturnResult.js'
import { BuildConfig, validateConfig } from './config.js'
import { getSiteFunction } from './getSiteFunction.js'
import { buildHtmlFiles, getHtmlFilepath, getScriptElements } from './html.js'
import { plugin } from './plugin.js'
import { copyStaticFolder, deleteBuildFolder } from './preBuild.js'
import { getFileLoaders, readMetafile } from './utils.js'

export const build = async (config: Partial<BuildConfig> = {}) => {
  const fullConfig = validateConfig(config)

  await deleteBuildFolder(fullConfig)
  const staticFiles = await copyStaticFolder(fullConfig)

  const first = await esbuild.build({
    ...getSharedEsbuildOptions(fullConfig),
    plugins: [plugin()],
    platform: 'node',
    entryPoints: [fullConfig.entry],
    outdir: fullConfig.out,
    metafile: true,
    format: fullConfig.write ? 'esm' : 'iife',
    // Ignore any hd-web dependencies.
    external: ['vite', 'esbuild', 'express']
  })

  // doesn't support splitting yet
  const files = readMetafile(first.metafile, fullConfig.out)
  const outfile = path.resolve(
    process.cwd(),
    files.find((f) => f.type === 'js')!.path
  )

  const pages = await buildPages(
    await getSiteFunction(outfile, first.outputFiles),
    fullConfig.joinTitles
  )

  const { html, components } = await buildHtmlFiles(
    pages.map(getHtmlFilepath),
    fullConfig,
    getScriptElements(files)
  )

  const js = getClientJs(components.map(({ filename }) => filename))

  // TODO I should remove the `__file` prop here if it exists?
  const final = await esbuild.build({
    ...getSharedEsbuildOptions(fullConfig),
    stdin: { contents: js, loader: 'js', resolveDir: '.' },
    outfile,
    platform: 'browser',
    allowOverwrite: true,
    format: 'esm'
  })

  if (fullConfig.write) {
    return
  }

  return buildReturnResult(
    fullConfig.out,
    outfile,
    first,
    final,
    html,
    staticFiles
  )
}

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
  loader: getFileLoaders(fileTypes)
})
