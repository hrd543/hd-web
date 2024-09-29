import path from 'path'
import { type WebSocket } from 'ws'
import { buildDev, createEntryContent, getPageBuilders } from './helpers.js'
import { getActivePages, validatePages } from '../shared/pages.js'
import { initialiseGlobals } from '../shared/globals.js'
import { defineCustomElements } from '../shared/js.js'
import {
  getCssPathFromJs,
  getHtmlTemplate,
  replaceHtml
} from '../shared/html.js'
import { buildFile } from '../shared/constants.js'
import FileSystem from './filesystem.js'
import { createDevServer, watch } from '@hd-web/dev-server'
import { BuildDevConfig, validateConfig } from './config.js'

const rebuild = async (
  entryContent: string,
  activePages: string[],
  htmlTemplate: string,
  filesystem: FileSystem,
  ws?: () => WebSocket | null
) => {
  console.log('Rebuilding...')
  const built = await buildDev(entryContent, 'src')
  // Need to define the global types BEFORE building the contents
  const getCustomElements = initialiseGlobals()
  const builders = getPageBuilders(built)
  const contents = await validatePages(builders, activePages)
  filesystem.write(buildFile, built + defineCustomElements(getCustomElements))
  filesystem.writeMultiple(
    activePages.map((p) => path.join(p, 'index.html')),
    contents.map((c) => replaceHtml(htmlTemplate, { body: c }))
  )

  ws?.()?.send('refresh')
  console.log('Finished rebuild')
}

/**
 * Start a dev server at the given port, and watch for changes in entryDir,
 * rebuilding and refreshing the page on each change.
 */
export const startDev = async (rawConfig: Partial<BuildDevConfig>) => {
  const { entryDir, pageFilename, port } = validateConfig(rawConfig)

  const activePages = await getActivePages(entryDir, pageFilename)
  const entryContent = createEntryContent(port, activePages, pageFilename)
  const htmlTemplate = replaceHtml(await getHtmlTemplate(entryDir), {
    script: `/${buildFile}`,
    css: getCssPathFromJs(`/${buildFile}`)
  })

  const filesystem = new FileSystem()
  await rebuild(entryContent, activePages, htmlTemplate, filesystem)
  const getWs = createDevServer(port, filesystem)

  await watch(entryDir, () =>
    rebuild(entryContent, activePages, htmlTemplate, filesystem, getWs)
  )
}
