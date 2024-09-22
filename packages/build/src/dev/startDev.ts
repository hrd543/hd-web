import { watch } from 'fs/promises'
import path from 'path'
import { type WebSocket } from 'ws'
import { debounce } from './debounce.js'
import { buildDev, createEntryContent, getPageBuilders } from './helpers.js'
import { getActivePages, validatePages } from '../shared/pages.js'
import { initialiseGlobals } from '../shared/globals.js'
import { defineCustomElements } from '../shared/js.js'
import {
  getCssPathFromJs,
  getHtmlTemplate,
  replaceHtml
} from '../shared/html.js'
import { BuildSiteConfig, validateConfig } from '../shared/config.js'
import { buildFile } from '../shared/constants.js'
import { createDevServer } from './server.js'
import FileSystem from './filesystem.js'

const rebuild = async (
  changedFiles: string[],
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

const handleChange = debounce(rebuild, 100, [], async (task, files) => {
  console.log(
    `Please wait until the current build has finished, queueing ${files}`
  )
  await task
})

export const startDev = async (rawConfig: Partial<BuildSiteConfig>) => {
  const filesystem = new FileSystem()
  const { entryDir, pageFilename } = validateConfig(rawConfig)

  const activePages = await getActivePages(entryDir, pageFilename)
  // await createPageDirectories(fs.mkdir, outDir, activePages)
  const entryContent = createEntryContent(8080, activePages, pageFilename)
  const htmlTemplate = replaceHtml(await getHtmlTemplate(entryDir), {
    script: `/${buildFile}`,
    css: getCssPathFromJs(`/${buildFile}`)
  })

  await rebuild([], entryContent, activePages, htmlTemplate, filesystem)

  const watcher = watch(entryDir, { recursive: true })
  const ws = createDevServer(8080, filesystem)

  for await (const event of watcher) {
    await handleChange(
      event.filename,
      entryContent,
      activePages,
      htmlTemplate,
      filesystem,
      ws
    )
  }
}
