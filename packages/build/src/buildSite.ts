import * as esbuild from 'esbuild'
import { initialiseGlobals } from './globals.js'
import { removeExports } from './removeExports.js'
import * as fs from 'fs/promises'
import { getFilePath } from './getFilePath.js'

const defaultConfig: esbuild.BuildOptions = {
  bundle: true
}

/**
 * Takes an entry point which default exports the main app jsx,
 * creates the html file from it, and builds the js excluding that
 * now unneeded function.
 * Also registers all used custom web components.
 */
export const buildSite = async (
  entry: string,
  out = 'main.js',
  htmlPath = 'index.html'
) => {
  // First bundle all the js into one file
  await esbuild.build({
    ...defaultConfig,
    entryPoints: [entry],
    outfile: out,
    // don't minify on the first pass to save time
    minify: false,
    // Use esm to preserve imports
    format: 'esm'
  })

  // Create the html string from the index.tsx file.
  // The default export from entry should be a component
  // Need to define the global types BEFORE importing the component
  const getAllElements = initialiseGlobals()
  const App = (await import(getFilePath(`./${entry}`, true))).default
  const html = App?.({})

  if (typeof html !== 'string') {
    throw new Error(`Default export from ./${entry} didn't return a string`)
  }

  // Remove all exports from the out file and define all the custom
  // elements which have been used.
  let file: fs.FileHandle | null = null
  try {
    file = await fs.open(getFilePath(out, false), 'r+')
    await removeExports(file)

    const customEls = getAllElements()
    const fileSize = (await file.stat()).size
    for (const element in customEls) {
      file.write(
        `customElements.define("${element}", ${customEls[element]});`,
        fileSize
      )
    }
  } catch (e) {
    throw e
  } finally {
    await file?.close()
  }

  // Now rebuild to remove unused code.
  await esbuild.build({
    ...defaultConfig,
    entryPoints: [out],
    outfile: out,
    allowOverwrite: true,
    // Minify since we will use this code in the browser
    minify: true,
    // Don't use esm now since this is used on the browser
    format: 'iife'
  })

  // And write the html to the file
  const htmlFile = await fs.readFile(getFilePath(htmlPath, false), 'utf-8')
  const newHtmlFile = htmlFile.replace(
    /<body>[\s\S]*<\/body>/,
    `<body>${html}</body>`
  )
  await fs.writeFile(getFilePath(htmlPath, false), newHtmlFile)
}
