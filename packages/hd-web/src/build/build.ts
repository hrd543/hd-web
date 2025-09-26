import fs from 'fs/promises'
import path from 'path'

import { getClientJs } from '../client/index.js'
import { buildSite } from '../shared/index.js'
import { buildReturnResult } from './builReturnResult.js'
import { BuildConfig, validateConfig } from './config.js'
import { getSite } from './getSite.js'
import { buildHtmlFiles, getScriptElements } from './html.js'
import { copyStaticFolder, deleteBuildFolder } from './preBuild.js'
import { runEsbuildFirst, runEsbuildLast } from './runEsbuild.js'
import { readMetafile } from './utils.js'
import { HdPlugin } from '../plugins/types.js'

export const build = async (
  config: Partial<BuildConfig> = {},
  plugins: Array<HdPlugin<BuildConfig>>
) => {
  const fullConfig = validateConfig(config)

  await deleteBuildFolder(fullConfig)
  const staticFiles = await copyStaticFolder(fullConfig)

  const first = await runEsbuildFirst(fullConfig)

  // doesn't support splitting yet
  const files = readMetafile(first.metafile, fullConfig.out)
  const outfile = path.resolve(
    process.cwd(),
    files.find((f) => f.type === 'js')!.path
  )

  const builtSite = await buildSite(
    await getSite(outfile, first.outputFiles),
    fullConfig
  )

  const { html, components } = await buildHtmlFiles(
    builtSite,
    fullConfig,
    getScriptElements(files)
  )

  const js = getClientJs(components.map(({ filename }) => filename))

  // TODO I should remove the `__file` prop here if it exists?
  const final = await runEsbuildLast(fullConfig, outfile, js)

  if (fullConfig.write) {
    if (!js) {
      await fs.rm(outfile)
    }

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
