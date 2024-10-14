import * as esbuild from 'esbuild'

const pagesName = '__pages'

/**
 * Returns the page builders given the entry content, which should
 * contain an array called pages.
 */
export const getPageBuilders = (contents: string) => {
  const f = new Function(contents + `return ${pagesName}.default;`)

  return f()
}

/**
 * Build the entry contents (as a string) containing imports
 * relative to dir
 */
export const buildDev = async (entryFile: string) => {
  const built = await esbuild.build({
    bundle: true,
    entryPoints: [entryFile],
    target: 'esnext',
    minify: false,
    allowOverwrite: true,
    format: 'iife',
    // Store the exports in a variable called pagesName,
    // so that they may be access above.
    globalName: pagesName,
    write: false
  })

  return built.outputFiles![0]!.text
}
