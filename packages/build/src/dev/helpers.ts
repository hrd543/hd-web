import { createRequire } from 'module'
import { getImportPath } from '../getFilePath.js'
import * as esbuild from 'esbuild'

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
    format: 'cjs',
    allowOverwrite: true
  })
}
