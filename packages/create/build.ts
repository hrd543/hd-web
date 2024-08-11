import * as esbuild from 'esbuild'
import { generateBuildConfig } from '../../build.js'
import { initialiseGlobals } from './globals.js'
import * as fs from 'fs'

const result = await esbuild.build(
  generateBuildConfig([], {
    entryPoints: ['src/index.tsx'],
    outfile: 'main.js',
    external: [],

    minify: false
  })
)

if (result.errors.length === 0) {
  const getAllElements = initialiseGlobals()
  const func = (await import('./src/index.tsx')).default
  const html = func({})

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
  await esbuild.build(
    generateBuildConfig([], {
      entryPoints: ['main.js'],
      outfile: 'main.js',
      external: [],

      minify: false,
      allowOverwrite: true
    })
  )

  // And write the html to the file
  const htmlFile = fs.readFileSync('./index.html', 'utf-8')
  const newHtmlFile = htmlFile.replace(
    /<body>[\s\S]*<\/body>/,
    `<body>${html}</body>`
  )
  fs.writeFileSync('./index.html', newHtmlFile)
}

/*

You write an create.js file which contains the jsx as html, in a function
with no args and the default export.

Then, we build this file, and run the exported function which creates the html
string.

Take this html and insert it into index.html inside the body.
Remove the default export function from the built file and check for unused code.
In most cases, this can be removed, however we need to be careful to not
remove class declarations since these will end up being unused.
This can be remedied by making the key getter keep track of all the
elements which were registered.
Then once we have created the html string, we get that list and inject
into the js file a list of customElements.define(...)

*/
