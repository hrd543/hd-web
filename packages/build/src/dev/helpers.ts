import { createRequire } from 'module'
import { getImportPath } from '../getFilePath.js'
import * as esbuild from 'esbuild'
import path from 'path'
import fs from 'fs/promises'
import { buildExportContent } from '../shared/js.js'
import { tempBuildFile } from '../shared/constants.js'
import { getRefreshClientScript } from './refreshClient.js'

/**
 * Returns the default export from file and then removes it
 * from the import cache to enable re-importing on change
 */
export const getPageBuilders = (file: string) => {
  // Need to require so that we can delete the cache
  const req = createRequire(import.meta.url)
  const moduleName = getImportPath(file)
  const builders = req(moduleName).default
  delete req.cache[req.resolve(moduleName)]

  return builders
}

const sharedBuildOptions: esbuild.BuildOptions = {
  bundle: true,
  target: 'esnext',
  minify: false,
  allowOverwrite: true
}

export const getBuildContexts = async (
  entryFile: string,
  outFile: string
): Promise<[esbuild.BuildContext, esbuild.BuildContext]> => {
  const entryCtx = await esbuild.context({
    ...sharedBuildOptions,
    entryPoints: [entryFile],
    outfile: outFile,
    // Using esm since we want to maintain the exports
    format: 'esm'
  })

  const outCtx = await esbuild.context({
    ...sharedBuildOptions,
    entryPoints: [outFile],
    outfile: outFile,
    // Using iife since this will run in the browser
    format: 'iife'
  })

  return [entryCtx, outCtx]
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
