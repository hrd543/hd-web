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
  getHtmlFile,
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
  config: BuildDevConfig,
  htmlTemplate: string,
  filesystem: FileSystem,
  ws?: () => WebSocket | null
) => {
  console.log('Rebuilding...')

  // Need to define the global types BEFORE building the contents
  const getCustomElements = initialiseGlobals()

  const built = await buildDev(config)
  const pages = await buildPages('', getPageBuilders(built.js))

  // Write the js to the filesystem, adding in what we need.
  filesystem.write(
    buildFile,
    insertIntoIife(built.js, defineCustomElements(getCustomElements)) +
      getRefreshClientScript(config.port)
  )

  // And write any other files (css / images) to the filesystem
  if (built.files.length) {
    built.files.forEach((file) => {
      filesystem.write(path.relative(process.cwd(), file.path), file.contents)
    })
  }

  pages.forEach(([p, content, is404]) => {
    filesystem.write(
      path.join(p, getHtmlFile(is404)),
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
  const config = validateConfig(rawConfig)

  const entryDir = path.dirname(config.entry)

  const htmlTemplate = replaceHtml(await getHtmlTemplate(entryDir), {
    script: buildScriptElements([buildFile]),
    css: buildStyleElements([getCssPathFromJs(buildFile)])
  })

  const filesystem = new FileSystem()
  await rebuild(config, htmlTemplate, filesystem)
  const getWs = createDevServer(config.port, filesystem)

  await watch(entryDir, () => rebuild(config, htmlTemplate, filesystem, getWs))
}
