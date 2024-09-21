import * as esbuild from 'esbuild'
import { buildPages } from '../shared/js.js'
import { getRefreshClientScript } from './refreshClient.js'

/**
 * Returns the page builders given the entry content, which should
 * contain an array called pages.
 */
export const getPageBuilders = (contents: string) => {
  const f = new Function(contents + 'return pages;')

  return f()
}

/**
 * Build the entry contents (as a string) containing imports
 * relative to dir
 */
export const buildDev = async (contents: string, dir: string) => {
  const built = await esbuild.build({
    bundle: true,
    target: 'esnext',
    minify: false,
    allowOverwrite: true,
    format: 'esm',
    write: false,
    stdin: {
      contents,
      resolveDir: dir
    }
  })

  return built.outputFiles![0]!.text
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
