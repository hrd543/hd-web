import * as esbuild from 'esbuild'
import { initialiseGlobals } from './globals.js'
import * as fs from 'fs'

const defaultConfig: esbuild.BuildOptions = {
  bundle: true,
  format: 'esm',
  minify: true
}

const result = await esbuild.build({
  ...defaultConfig,
  entryPoints: ['src/index.tsx'],
  outfile: 'main.js'
})

if (result.errors.length === 0) {
  const getAllElements = initialiseGlobals()
  // Need to import after we've defined the global types
  const App = (await import('./src/index.tsx')).default
  const html = App({})

  // Now remove all exports from main. This can defo be improved
  const fileData = fs.readFileSync('./main.js', 'utf-8')
  let newFileData = fileData.replace(/export[\s\S]*};(\s)*$/, '')
  // And add all the custom element definitions
  const customEls = getAllElements()
  for (const element in customEls) {
    newFileData = newFileData.concat(
      `customElements.define("${element}", ${customEls[element]});`
    )
  }

  fs.writeFileSync('./main.js', newFileData)

  // Now rebuild to remove unused code.
  await esbuild.build({
    ...defaultConfig,
    entryPoints: ['main.js'],
    outfile: 'main.js',
    allowOverwrite: true
  })

  // And write the html to the file
  const htmlFile = fs.readFileSync('./index.html', 'utf-8')
  const newHtmlFile = htmlFile.replace(
    /<body>[\s\S]*<\/body>/,
    `<body>${html}</body>`
  )
  fs.writeFileSync('./index.html', newHtmlFile)
}
