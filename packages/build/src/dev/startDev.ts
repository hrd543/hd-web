import { BuildSiteConfig, validateConfig } from '../site/config.js'
import fs from 'fs/promises'
import * as esbuild from 'esbuild'
import { debounce } from './debounce.js'
import { initialiseGlobals } from '../site/globals.js'
import path from 'path'
import { buildFile, tempBuildFile } from '../site/constants.js'
import { getActivePages } from '../site/getActivePages.js'
import { buildExports } from '../site/getPageBuilders.js'
import { getCssPathFromJs, replaceHtml } from '../site/writeToHtml.js'
import { getImportPath } from '../getFilePath.js'
import { validatePages } from '../site/validatePages.js'
import { defineCustomElements } from '../site/processJs.js'
import { createRequire } from 'module'

const handleChange = debounce(
  async (
    changedFiles: string[],
    ctx: esbuild.BuildContext,
    activePages: string[],
    outFile: string,
    htmlTemplate: string,
    outDir: string
  ) => {
    await rebuild(changedFiles, ctx, activePages, outFile, htmlTemplate, outDir)
  },
  100
)

const rebuild = async (
  changedFiles: string[],
  ctx: esbuild.BuildContext,
  activePages: string[],
  outFile: string,
  htmlTemplate: string,
  outDir: string
) => {
  // Need to define the global types BEFORE importing the component
  const getCustomElements = initialiseGlobals()
  await ctx.rebuild()
  const req = createRequire(import.meta.url)
  const moduleName = getImportPath(outFile)
  const builders = req(moduleName).default
  delete req.cache[req.resolve(moduleName)]
  const contents = await validatePages(builders, activePages)
  await fs.appendFile(outFile, defineCustomElements(getCustomElements))
  for (let i = 0; i < activePages.length; i++) {
    await fs.writeFile(
      path.join(outDir, activePages[i]!, 'index.html'),
      replaceHtml(htmlTemplate, { body: contents[i]! })
    )
  }

  console.log('rebuilt', contents)
}

export const buildDev = async (rawConfig: Partial<BuildSiteConfig>) => {
  const { entryDir, outDir, pageFilename } = validateConfig(rawConfig)
  const outFile = path.resolve(outDir, buildFile)

  const activePages = await getActivePages(entryDir, pageFilename)

  for (const page of activePages) {
    await fs.mkdir(path.join(outDir, page), { recursive: true })
  }

  const entryContent = buildExports(
    activePages.map((page) => path.join(page, pageFilename))
  )
  const pageExportsFile = path.join(entryDir, tempBuildFile)
  await fs.writeFile(pageExportsFile, entryContent)

  const htmlTemplate = replaceHtml(
    await fs.readFile(path.resolve(entryDir, 'index.html'), 'utf-8'),
    {
      script: `/${buildFile}`,
      css: getCssPathFromJs(`/${buildFile}`)
    }
  )

  const ctx = await esbuild.context({
    bundle: true,
    target: 'esnext',
    entryPoints: [pageExportsFile],
    outfile: outFile,
    minify: false,
    // Using common js so that we can bust the import cache
    format: 'cjs',
    allowOverwrite: true
  })

  await rebuild([], ctx, activePages, outFile, htmlTemplate, outDir)

  const watcher = fs.watch(entryDir, { recursive: true })

  for await (const event of watcher) {
    await handleChange(
      event.filename,
      ctx,
      activePages,
      outFile,
      htmlTemplate,
      outDir
    )
  }
}

/**

When you first run the dev command:
- Initialise the globals
- Get the active pages
- Build the index file which exports all the pages
- Make the directories for each of the index.html
- Read the template html into memory and replace the script / style elements.

Then, and on each file change
- Rebuild the js
- Import each of the pages
- Run the pages to get the html
- Write this html to each of the pages

Now that we have the html and js, serve it
 */
