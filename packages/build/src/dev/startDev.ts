import fs from 'fs/promises'
import * as esbuild from 'esbuild'
import { type WebSocket } from 'ws'
import { debounce } from './debounce.js'
import {
  createEntryFile,
  getBuildContexts,
  getPageBuilders
} from './helpers.js'
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
import { buildFile, tempBuildFile } from '../shared/constants.js'
import { createDevServer } from './server.js'

const rebuild = async (
  changedFiles: string[],
  ctx: [entry: esbuild.BuildContext, out: esbuild.BuildContext],
  activePages: string[],
  outFile: string,
  htmlTemplate: string,
  outDir: string,
  ws: () => WebSocket | null
) => {
  console.log('rebuilding...')
  // Need to define the global types BEFORE importing the component
  const getCustomElements = initialiseGlobals()
  await ctx[0].rebuild()
  const builders = getPageBuilders(outFile)
  const contents = await validatePages(builders, activePages)
  await fs.appendFile(outFile, defineCustomElements(getCustomElements))
  await createPages(
    outDir,
    activePages,
    contents.map((c) => replaceHtml(htmlTemplate, { body: c }))
  )

  await ctx[1].rebuild()
  ws()?.send('refresh')
  console.log('Finished rebuild')
}

const handleChange = debounce(
  rebuild,
  100,
  [tempBuildFile],
  async (task, files) => {
    console.log(
      `Please wait until the current build has finished, queueing ${files}`
    )
    await task
  }
)

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

  const ctx = await getBuildContexts(entryFile, outFile)
  await rebuild([], ctx, activePages, outFile, htmlTemplate, outDir, () => null)

  const watcher = fs.watch(entryDir, { recursive: true })
  const ws = createDevServer(8080, outDir)

  for await (const event of watcher) {
    await handleChange(
      event.filename,
      ctx,
      activePages,
      outFile,
      htmlTemplate,
      outDir,
      ws
    )
  }

  // Delete the entry file when the process exits
  // Also call ctx.dispose()
}

buildDev({})
