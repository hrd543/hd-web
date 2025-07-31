import path from 'path'
import { type WebSocket } from 'ws'
import { buildDev, getPageBuilders, insertIntoIife } from './helpers.js'
import { buildHtml, getCssPathFromJs, getHtmlFilepath } from '../shared/html.js'
import { buildFile } from '../shared/constants.js'
import FileSystem from '../shared/filesystem.js'
import { createDevServer, watch } from '@hd-web/dev-server'
import { BuildDevConfig, validateConfig } from './config.js'
import { buildPages } from '../shared/pages.js'
import { getRefreshClientScript } from './refreshClient.js'
import {
  defineInteractions,
  initialiseInteractions
} from '../shared/interactivity.js'

const rebuild = async (
  config: BuildDevConfig,
  filesystem: FileSystem,
  ws?: () => WebSocket | null
) => {
  console.log('Rebuilding...')

  // Need to define the global types BEFORE building the contents
  initialiseInteractions()

  const built = await buildDev(config)
  const pages = await buildPages(getPageBuilders(built.js), config.joinTitles)

  // Write the js to the filesystem, adding in what we need.
  filesystem.write(
    buildFile,
    insertIntoIife(built.js, defineInteractions()) +
      getRefreshClientScript(config.port)
  )

  // And write any other files (css / images) to the filesystem
  if (built.files.length) {
    built.files.forEach((file) => {
      filesystem.write(path.relative(process.cwd(), file.path), file.contents)
    })
  }

  // Finally write the page html files to the filesystem
  pages.forEach(([p, content, createFolder]) => {
    filesystem.write(
      getHtmlFilepath(p, createFolder),
      buildHtml(
        content,
        config.lang,
        [buildFile],
        [getCssPathFromJs(buildFile)]
      )
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

  const filesystem = new FileSystem()
  await rebuild(config, filesystem)
  const getWs = createDevServer(config.port, filesystem)

  await watch(entryDir, () => rebuild(config, filesystem, getWs))
}
