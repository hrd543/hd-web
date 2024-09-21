import fs from 'fs/promises'
import { type WebSocket } from 'ws'
import { debounce } from './debounce.js'
import { buildDev, createEntryContent, getPageBuilders } from './helpers.js'
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
  entryContent: string,
  activePages: string[],
  outFile: string,
  htmlTemplate: string,
  outDir: string,
  ws: () => WebSocket | null
) => {
  console.log('rebuilding...')
  const built = await buildDev(entryContent, 'src')
  // Need to define the global types BEFORE building the contents
  const getCustomElements = initialiseGlobals()
  const builders = getPageBuilders(built)
  const contents = await validatePages(builders, activePages)
  await fs.writeFile(outFile, built + defineCustomElements(getCustomElements))
  await createPages(
    outDir,
    activePages,
    contents.map((c) => replaceHtml(htmlTemplate, { body: c }))
  )

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

export const startDev = async (rawConfig: Partial<BuildSiteConfig>) => {
  const { entryDir, outDir, pageFilename } = validateConfig(rawConfig)

  const outFile = getBuildFile(outDir)
  const activePages = await getActivePages(entryDir, pageFilename)
  await createPageDirectories(fs.mkdir, outDir, activePages)
  const entryContent = createEntryContent(8080, activePages, pageFilename)
  const htmlTemplate = replaceHtml(await getHtmlTemplate(entryDir), {
    script: `/${buildFile}`,
    css: getCssPathFromJs(`/${buildFile}`)
  })

  await rebuild(
    [],
    entryContent,
    activePages,
    outFile,
    htmlTemplate,
    outDir,
    () => null
  )

  const watcher = fs.watch(entryDir, { recursive: true })
  const ws = createDevServer(8080, outDir)

  for await (const event of watcher) {
    await handleChange(
      event.filename,
      entryContent,
      activePages,
      outFile,
      htmlTemplate,
      outDir,
      ws
    )
  }
}
