import fs from 'fs/promises'
import path from 'path'
import { buildHtml, addMetaToHead, getHtmlFilepath } from '../shared/html.js'
import { BuiltPage } from '../shared/types.js'
import { BuildSiteConfig } from './config.js'

export type BuiltFile = {
  path: string
  relativePath: string
  type: string
  isEntry?: true
}

/**
 * Create all necessary html files for the build pages, including
 * the styles, js and assets needed for the site.
 */
export const writeToHtml = async (
  pages: BuiltPage[],
  { lang }: BuildSiteConfig,
  built: BuiltFile[],
  out: string
) => {
  // Create directories for each page which needs it
  await Promise.all(
    pages
      .filter(([, , createFolder]) => createFolder)
      .map(([p]) => fs.mkdir(path.join(out, p), { recursive: true }))
  )

  // Create the index.html files by replacing the template with the necessary
  // content and script locations
  await Promise.all(
    pages.map(([p, content, hasChildren], i) => {
      const filepath = getHtmlFilepath(
        path.join(out, p),
        hasChildren || i === 0
      )

      const head = addMetaToHead(
        content.head,
        content.title,
        content.description,
        built
          .filter((file) => file.type === '.js')
          .map((file) => file.relativePath),
        built
          .filter((file) => file.type === '.css')
          .map((file) => file.relativePath)
      )

      return fs.writeFile(filepath, buildHtml(head, content.body, lang))
    })
  )
}
