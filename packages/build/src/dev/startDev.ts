import fs from 'fs/promises'
import * as esbuild from 'esbuild'
import { debounce } from './debounce.js'
import { createEntryFile, getBuildContext, getPageBuilders } from './helpers.js'
import {
  createPageDirectories,
  createPages,
  getActivePages,
  validatePages
} from '../shared/pages.js'
import { initialiseGlobals } from '../shared/globals.js'
import { defineCustomElements } from '../shared/js.js'
import {
  getCssPathFromJs,
  getHtmlTemplate,
  replaceHtml
} from '../shared/html.js'
import { BuildSiteConfig, validateConfig } from '../shared/config.js'
import { getBuildFile } from '../shared/files.js'
import { buildFile } from '../shared/constants.js'

const rebuild = async (
  changedFiles: string[],
  ctx: esbuild.BuildContext,
  activePages: string[],
  outFile: string,
  htmlTemplate: string,
  outDir: string
) => {
  console.log('rebuilding...')
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
  console.log('Finished rebuild')
}

const handleChange = debounce(rebuild, 100, async (task, files) => {
  console.log(
    `Please wait until the current build has finished, queueing ${files}`
  )
  await task
})

export const buildDev = async (rawConfig: Partial<BuildSiteConfig>) => {
  const { entryDir, outDir, pageFilename } = validateConfig(rawConfig)
  const outFile = getBuildFile(outDir)
  const activePages = await getActivePages(entryDir, pageFilename)
  await createPageDirectories(outDir, activePages)
  const entryFile = await createEntryFile(
    8080,
    entryDir,
    activePages,
    pageFilename
  )
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
