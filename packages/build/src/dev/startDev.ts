import path from 'path'
import { type WebSocket } from 'ws'
import { buildDev, getPageBuilders, insertIntoIife } from './helpers.js'
import {
  defineCustomElements,
  initialiseGlobals
} from '../shared/customElements.js'
import {
  buildScriptElements,
  buildStyleElements,
  getCssPathFromJs,
  getHtmlTemplate,
  replaceHtml
} from '../shared/html.js'
import { buildFile } from '../shared/constants.js'
import FileSystem from './filesystem.js'
import { createDevServer, watch } from '@hd-web/dev-server'
import { BuildDevConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import { getRefreshClientScript } from './refreshClient.js'

const rebuild = async (
  port: number,
  entryFile: string,
  htmlTemplate: string,
  filesystem: FileSystem,
  ws?: () => WebSocket | null
) => {
  console.log('Rebuilding...')

  // Need to define the global types BEFORE building the contents
  const getCustomElements = initialiseGlobals()

  const built = await buildDev(entryFile)
  const pages = await buildPages('', getPageBuilders(built.js))

  // Write the js to the filesystem, adding in what we need.
  filesystem.write(
    buildFile,
    insertIntoIife(built.js, defineCustomElements(getCustomElements)) +
      getRefreshClientScript(port)
  )

  // And write the css if it exists.
  if (built.css) {
    filesystem.write(getCssPathFromJs(buildFile), built.css)
  }

  pages.forEach(([p, content]) => {
    filesystem.write(
      path.join(p, 'index.html'),
      replaceHtml(htmlTemplate, { body: content })
    )
  })

  ws?.()?.send('refresh')
  console.log('Finished rebuild')
}

/**
 * Start a dev server at the given port, and watch for changes in entryDir,
 * rebuilding and refreshing the page on each change.
 */
export const startDev = async (rawConfig: Partial<BuildDevConfig>) => {
  const { entry, port } = validateConfig(rawConfig)
  const entryDir = path.dirname(entry)

  const htmlTemplate = replaceHtml(await getHtmlTemplate(entryDir), {
    script: buildScriptElements([buildFile]),
    css: buildStyleElements([getCssPathFromJs(buildFile)])
  })

  const filesystem = new FileSystem()
  await rebuild(port, entry, htmlTemplate, filesystem)
  const getWs = createDevServer(port, filesystem)

  await watch(entryDir, () =>
    rebuild(port, entry, htmlTemplate, filesystem, getWs)
  )
}
