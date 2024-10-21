import * as esbuild from 'esbuild'
import { buildFile } from '../shared/constants.js'

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
    write: false,
    // This is needed just so the css is written to a "file"
    outfile: buildFile
  })

  // Now find the js and css files (if they exist)
  const js = built.outputFiles.find((f) => f.path.endsWith('.js'))!
  const css = built.outputFiles.find((f) => f.path.endsWith('.css'))

  // and return their content
  return {
    js: js.text,
    css: css?.text
  }
}

export const insertIntoIife = (built: string, add: string) => {
  // Find the final return statement.
  const index = built.lastIndexOf('return ')

  // And insert the content at this position
  return built.slice(0, index) + add + built.slice(index)
}
