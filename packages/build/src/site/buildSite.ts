import * as esbuild from 'esbuild'
import { initialiseGlobals } from './globals.js'
import { removeExports } from './removeExports.js'
import * as fs from 'fs/promises'
import { getFilePath } from '../getFilePath.js'
import { removeUnusedCode } from './removeUnusedCode.js'
import { writeToHtml } from './writeToHtml.js'
import type { BuildFilePaths } from './types.js'
import { buildExports, findAllPages } from './findAllPages.js'
import path from 'path'

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
export const buildSite = async (entryDir: string, outDir: string) => {
  console.log(process.cwd())
  if (entryDir === outDir) {
    throw new Error("Can't have input the same as output")
  }

  const outFile = path.join(outDir, 'main.js')

  // First create the export file
  const files = await fs.readdir(entryDir, {
    recursive: true,
    withFileTypes: true
  })

  const indexPages = findAllPages(files)
  const entryContent = buildExports(entryDir, indexPages)
  await fs.writeFile('_main.js', entryContent)

  // First bundle all the js into one file
  await esbuild.build({
    ...defaultConfig,
    entryPoints: ['_main.js'],
    outfile: outFile,
    // don't minify on the first pass to save time
    minify: false,
    // Use esm to preserve imports
    format: 'esm'
  })

  // Create the html string from the index.tsx file.

  // Need to define the global types BEFORE importing the component
  const getAllElements = initialiseGlobals()
  // We need to use the file we just built so that names line up
  const pages = (await import(getFilePath(`./${outFile}`, true))).default
  if (!Array.isArray(pages)) {
    throw new Error(
      "Pages wasn't an array - did you forget to add any index files?"
    )
  }

  const htmlContents = pages.map((page, i) => {
    if (typeof page !== 'function') {
      throw new Error(`Default export at ${indexPages[i]!} isn't a function`)
    }

    const content = page()

    if (typeof content !== 'string') {
      throw new Error(
        `Default export at ${indexPages[i]!} doesn't return a string`
      )
    }

    return content
  })

  // Remove all exports from the out file and define all the custom
  // elements which have been used.
  let file: fs.FileHandle | null = null
  try {
    file = await fs.open(getFilePath(outFile, false), 'r+')
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
    await removeUnusedCode(outFile, defaultConfig),
    // And write the html to the file
    await writeToHtml(htmlBody, html, js)
  ])
}

/*

HELPFUL
process.cwd() returns where the node process was started.
E.g. if I am anywhere inside src (src/examples, src/tests/a, ...), and I run
npm run build where build is from the package.json at ., then cwd will give me .
However, if I'm in src/examples and I run node ../../build.js, then cwd will give me
src/examples

Example structure. In this example, cwd would be Documents/code/hd-web
src
  about
    index.tsx
  contact
    index.tsx
  utils
    add.ts
    subtract.ts
  index.html
  index.tsx
  index.css
tsconfig.json
build.ts <= This is where the command is likely to be run from

I run the build function with entryDir = "src" and outDir = "build"

From this, I find that the folders with index files are
".", "about", "contact"
since this will be relative to entryDir = "src"

I would then create a file with the following contents at  ".":
import {default as a0} from "./src/index.tsx";
import {default as a1} from "./src/about/index.tsx";
import {default as a2} from "./src/contact/index.tsx";
const pages = [a0, a1, a2];
export default pages;

(NB the above imports needn't be relative, could use getFilePath(x, true))

Now I create a js file at build/main.js which includes that pages export.
I import the main.js file and run all the functions in the pages array.
This gives me an array of html bodies, which follow the same order as the pages array.

I add all of the custom element definitions to the main.js file (inside build/)

I remove the unused code from the main.js file

I create index.html files in each of the directories in the pages array.



*/
