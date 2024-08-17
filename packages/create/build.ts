import * as esbuild from 'esbuild'
import { initialiseGlobals } from './globals.js'
import { removeExports } from './removeExports.js'
import * as fs from 'fs/promises'

const defaultConfig: esbuild.BuildOptions = {
  bundle: true
}

// First bundle all the js into one file
await esbuild.build({
  ...defaultConfig,
  entryPoints: ['src/index.tsx'],
  outfile: 'main.js',
  // don't minify on the first pass to save time
  minify: false,
  // Use esm to preserve imports
  format: 'esm'
})

// Create the html string from the index.tsx file
// Need to import after we've defined the global types
const getAllElements = initialiseGlobals()
const App = (await import('./src/index.tsx')).default
const html = App({})

// Remove all exports from main. This can defo be improved
let file: fs.FileHandle | null = null
try {
  file = await fs.open('./main.js', 'r+')
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

// Now rebuild to remove unused code. Is there a better way to do this?
await esbuild.build({
  ...defaultConfig,
  entryPoints: ['main.js'],
  outfile: 'main.js',
  allowOverwrite: true,
  // Minify since we will use this code in the browser
  minify: true,
  // Don't use esm now since this is used on the browser
  format: 'iife'
})

// And write the html to the file
const htmlFile = await fs.readFile('./index.html', 'utf-8')
const newHtmlFile = htmlFile.replace(
  /<body>[\s\S]*<\/body>/,
  `<body>${html}</body>`
)
await fs.writeFile('./index.html', newHtmlFile)
