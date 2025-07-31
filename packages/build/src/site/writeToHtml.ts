import fs from 'fs/promises'
import path from 'path'
import { buildHtml, buildHtmlHead, getHtmlFilepath } from '../shared/html.js'
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
  html: string[],
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
    pages.map(([p, content, createFolder], i) => {
      const filepath = getHtmlFilepath(path.join(out, p), createFolder)

      const head = buildHtmlHead(
        content,
        built
          .filter((file) => file.type === '.js')
          .map((file) => file.relativePath),
        built
          .filter((file) => file.type === '.css')
          .map((file) => file.relativePath)
      )

      return fs.writeFile(filepath, buildHtml(head, html[i]!, lang))
    })
  )
}
