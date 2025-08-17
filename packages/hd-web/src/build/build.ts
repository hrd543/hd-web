import * as esbuild from 'esbuild'
import { buildPages } from './buildPages.js'
import { writeToHtml } from './buildHtml.jsx'
import { getClientJs } from '../client/index.js'
import { plugin } from './plugin.js'
import { getFileLoaders, readMetafile } from './utils.js'
import { BuildSiteConfig, validateConfig } from './config.js'

export const build = async (config: Partial<BuildSiteConfig> = {}) => {
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
  const outfile = files.find((f) => f.type === 'js')!.path

  const pages = await buildPages((await import(outfile)).default, true)

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
  config: BuildSiteConfig
): esbuild.BuildOptions => ({
  minify: true,
  bundle: true,
  treeShaking: true,
  format: 'esm',
  target: config.target,
  publicPath: '/',
  loader: getFileLoaders(config.fileTypes)
})
