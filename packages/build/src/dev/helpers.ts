import * as esbuild from 'esbuild'
import { buildPages } from '../shared/js.js'
import { getRefreshClientScript } from './refreshClient.js'

/**
 * Returns the default export from file and then removes it
 * from the import cache to enable re-importing on change
 */
export const getPageBuilders = (contents: string) => {
  const f = new Function(contents + 'return pages;')

  return f()
}

const sharedBuildOptions: esbuild.BuildOptions = {
  bundle: true,
  target: 'esnext',
  minify: false,
  allowOverwrite: true,
  format: 'esm',
  write: false
}

export const build = async (contents: string, dir: string) => {
  const built = await esbuild.build({
    ...sharedBuildOptions,
    stdin: {
      contents,
      resolveDir: dir
    }
  })

  return built.outputFiles![0]!.text
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

export const createEntryContent = (
  port: number,
  activePages: string[],
  pageFilename: string
) => {
  const exports = buildPages(activePages, pageFilename, false)
  const refreshScript = getRefreshClientScript(port)

  return exports + refreshScript
}
