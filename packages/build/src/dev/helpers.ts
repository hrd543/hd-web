import * as esbuild from 'esbuild'

const pagesName = '__pages'

/**
 * Returns the page builders given the entry content, which should
 * contain a variable with name pagesName and property default.
 *
 * This is the behaviour of using esbuild with format iife and
 * globalName pagesName.
 */
export const getPageBuilders = (contents: string) => {
  const f = new Function(contents + `return ${pagesName}.default;`)

  return f()
}

/**
 * Build the js file located at entryFile into a string
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
