import fs from 'fs/promises'
import * as esbuild from 'esbuild'
import { debounce } from './debounce.js'
import { getBuildContext, getPageBuilders } from './helpers.js'
import {
  createPageDirectories,
  createPages,
  getActivePages,
  validatePages
} from '../shared/pages.js'
import { initialiseGlobals } from '../shared/globals.js'
import { createEntryFile, defineCustomElements } from '../shared/js.js'
import {
  getCssPathFromJs,
  getHtmlTemplate,
  replaceHtml
} from '../shared/html.js'
import { BuildSiteConfig, validateConfig } from '../shared/config.js'
import { getBuildFile } from '../shared/files.js'
import { buildFile } from '../shared/constants.js'

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
  const builders = getPageBuilders(outFile)
  const contents = await validatePages(builders, activePages)
  await fs.appendFile(outFile, defineCustomElements(getCustomElements))
  await createPages(
    outDir,
    activePages,
    contents.map((c) => replaceHtml(htmlTemplate, { body: c }))
  )
}

export const buildDev = async (rawConfig: Partial<BuildSiteConfig>) => {
  const { entryDir, outDir, pageFilename } = validateConfig(rawConfig)
  const outFile = getBuildFile(outDir)

  const activePages = await getActivePages(entryDir, pageFilename)
  await createPageDirectories(outDir, activePages)

  const entryFile = await createEntryFile(entryDir, activePages, pageFilename)

  const htmlTemplate = replaceHtml(await getHtmlTemplate(entryDir), {
    script: `/${buildFile}`,
    css: getCssPathFromJs(`/${buildFile}`)
  })

  const ctx = await getBuildContext(entryFile, outFile)

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

  // Delete the entry file when the process exits
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
