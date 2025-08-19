import * as esbuild from 'esbuild'
import { buildPages } from '../shared/index.js'
import { writeToHtml } from './buildHtml.jsx'
import { getClientJs } from '../client/index.js'
import { plugin } from './plugin.js'
import { getFileLoaders, readMetafile } from './utils.js'
import { BuildConfig, validateConfig } from './config.js'
import path from 'path'
import url from 'url'

export const build = async (config: Partial<BuildConfig> = {}) => {
  const fullConfig = validateConfig(config)

  const built = await esbuild.build({
    ...getSharedEsbuildOptions(fullConfig),
    plugins: [plugin()],
    platform: 'node',
    entryPoints: [fullConfig.entry],
    outdir: fullConfig.out,
    metafile: true
  })

  // doesn't support splitting yet
  const files = readMetafile(built.metafile, fullConfig.out)
  const outfile = path.resolve(
    process.cwd(),
    files.find((f) => f.type === 'js')!.path
  )

  const pages = await buildPages(
    (await import(url.pathToFileURL(outfile).href)).default,
    true
  )

  const components = (
    await Promise.all(pages.map((page) => writeToHtml(page, fullConfig, files)))
  ).flat()

  const js = getClientJs(components.map(({ filename }) => filename))

  await esbuild.build({
    ...getSharedEsbuildOptions(fullConfig),
    stdin: { contents: js, loader: 'js', resolveDir: '.' },
    outfile,
    platform: 'browser',
    allowOverwrite: true
  })
}

const getSharedEsbuildOptions = (
  config: BuildConfig
): esbuild.BuildOptions => ({
  minify: true,
  bundle: true,
  treeShaking: true,
  format: 'esm',
  target: config.target,
  publicPath: '/',
  loader: getFileLoaders(config.fileTypes),
  // This doesn't work, TODO work it out
  pure: ['registerClient']
})
