import { initialiseGlobals } from './globals.js'
import { formatJs } from './formatJs.js'
import { removeUnusedCode } from './removeUnusedCode.js'
import { writeToHtml } from './writeToHtml.js'
import { buildFile, defaultConfig } from './constants.js'
import * as path from 'path'
import { buildJs } from './buildJs.js'
import { buildHtml } from './buildHtml.js'

export const buildSite = async (entryDir: string, outDir: string) => {
  if (entryDir === outDir) {
    throw new Error("Can't have input the same as output")
  }

  const outFile = path.resolve(outDir, buildFile)

  const activePages = await buildJs(entryDir, outFile)
  // Need to define the global types BEFORE importing the component
  const getCustomElements = initialiseGlobals()
  // Create the html string from the index.tsx file.
  const htmlContents = await buildHtml(activePages, outFile)
  await formatJs(outFile, getCustomElements)

  await Promise.all([
    // Now rebuild to remove unused code.
    await removeUnusedCode(outFile, defaultConfig),
    // And write the html to the file
    await writeToHtml(activePages, htmlContents, entryDir, outDir)
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
