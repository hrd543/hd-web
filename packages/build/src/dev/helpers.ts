import * as esbuild from 'esbuild'
import { buildFile, defaultConfig } from '../shared/constants.js'
import { BuildDevConfig } from './config.js'

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
export const buildDev = async (config: BuildDevConfig) => {
  const built = await esbuild.build({
    ...defaultConfig,
    entryPoints: [config.entry],
    target: 'esnext',
    treeShaking: false,
    minify: false,
    allowOverwrite: true,
    format: 'iife',
    // Store the exports in a variable called pagesName,
    // so that they may be access above.
    globalName: pagesName,
    write: false,
    // This is needed just so the css is written to a "file"
    outfile: buildFile,
    // The code is run in node for the dev server
    platform: 'node'
  })

  // Now get the js content and any other files used.
  let js = ''
  const otherFiles: esbuild.OutputFile[] = []

  built.outputFiles.forEach((file) => {
    if (file.path.endsWith('.js')) {
      js = file.text
    } else {
      otherFiles.push(file)
    }
  })

  return {
    js: js!,
    files: otherFiles
  }
}

export const insertIntoIife = (built: string, add: string) => {
  // Find the final return statement.
  const index = built.lastIndexOf('return ')

  // And insert the content at this position
  return built.slice(0, index) + add + built.slice(index)
}
