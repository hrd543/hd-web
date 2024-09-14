import { createRequire } from 'module'
import { getImportPath } from '../getFilePath.js'
import * as esbuild from 'esbuild'
import path from 'path'
import fs from 'fs/promises'
import { buildExportContent } from '../shared/js.js'
import { tempBuildFile } from '../shared/constants.js'
import { getRefreshClientScript } from './refreshClient.js'

export const getPageBuilders = (file: string) => {
  // Need to require so that we can delete the cache and re-import
  const req = createRequire(import.meta.url)
  const moduleName = getImportPath(file)
  const builders = req(moduleName).default
  delete req.cache[req.resolve(moduleName)]

  return builders
}

export const getBuildContext = (entryFile: string, outFile: string) => {
  return esbuild.context({
    bundle: true,
    target: 'esnext',
    entryPoints: [entryFile],
    outfile: outFile,
    minify: false,
    // Using common js so that we can bust the import cache
    format: 'esm',
    allowOverwrite: true
  })
}

export const createEntryFile = async (
  port: number,
  entryDir: string,
  activePages: string[],
  pageFilename: string
) => {
  const entry = path.join(entryDir, tempBuildFile)
  const exports = buildExportContent(activePages, pageFilename)
  const refreshScript = getRefreshClientScript(port)

  await fs.writeFile(entry, exports + refreshScript)

  return entry
}
