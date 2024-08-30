import * as esbuild from 'esbuild'
import { initialiseGlobals } from './globals.js'
import { removeExports } from './removeExports.js'
import * as fs from 'fs/promises'
import { getFilePath } from '../getFilePath.js'
import { removeUnusedCode } from './removeUnusedCode.js'
import { writeToHtml } from './writeToHtml.js'
import type { BuildFilePaths } from './types.js'

const defaultConfig: esbuild.BuildOptions = {
  bundle: true,
  target: 'es6'
}

/**
 * Takes an entry point which default exports the main app jsx,
 * creates the html file from it, and builds the js excluding that
 * now unneeded function.
 * Also registers all used custom web components.
 */
export const buildSite = async (js: BuildFilePaths, html: BuildFilePaths) => {
  if (js.entry === js.output) {
    throw new Error("Can't have js input the same as js output")
  }
  if (html.entry === html.output) {
    console.warn(
      'Using the same html input and output might cause problems when rebuilding.'
    )
  }

  // First bundle all the js into one file
  await esbuild.build({
    ...defaultConfig,
    entryPoints: [js.entry],
    outfile: js.output,
    // don't minify on the first pass to save time
    minify: false,
    // Use esm to preserve imports
    format: 'esm'
  })

  // Create the html string from the index.tsx file.

  // Need to define the global types BEFORE importing the component
  const getAllElements = initialiseGlobals()
  // We need to use the file we just built so that names line up
  const App = (await import(getFilePath(`./${js.output}`, true))).default
  // The default export from entry should be a component
  const htmlBody = App?.({})

  if (typeof htmlBody !== 'string') {
    throw new Error(`Default export from ${js.entry} didn't return a string`)
  }

  // Remove all exports from the out file and define all the custom
  // elements which have been used.
  let file: fs.FileHandle | null = null
  try {
    file = await fs.open(getFilePath(js.output, false), 'r+')
    await removeExports(file)

    const customEls = getAllElements()
    let customElsDefinition = ''

    for (const element in customEls) {
      customElsDefinition += `customElements.define("${element}", ${customEls[element]});`
    }

    file.write(customElsDefinition, (await file.stat()).size)
  } finally {
    await file?.close()
  }

  await Promise.all([
    // Now rebuild to remove unused code.
    await removeUnusedCode(js.output, defaultConfig),
    // And write the html to the file
    await writeToHtml(htmlBody, html, js)
  ])
}
