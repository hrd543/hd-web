import fs from 'fs/promises'
import path from 'path'
import {
  buildScriptElements,
  buildStyleElements,
  getHtmlTemplate,
  replaceHtml
} from '../shared/html.js'
import { BuiltPage } from '../shared/types.js'
import { BuiltFile } from './bundleJs.js'

/**
 * Using the template at html.entry, replace its body with htmlBody
 * and link the style and script tags appropriately.
 */
export const writeToHtml = async (
  pages: BuiltPage[],
  entry: string,
  built: BuiltFile[]
) => {
  const htmlTemplate = await getHtmlTemplate(entry)

  // Create directories for each page
  await Promise.all(pages.map(([p]) => fs.mkdir(p, { recursive: true })))

  // Create the index.html files by replacing the template with the necessary
  // content and script locations
  await Promise.all(
    pages.map(([p, content]) =>
      fs.writeFile(
        path.join(p, 'index.html'),
        replaceHtml(htmlTemplate, {
          script: buildScriptElements(
            built
              .filter((file) => file.type === 'js')
              .map((file) => file.relativePath)
          ),
          css: buildStyleElements(
            built
              .filter((file) => file.type === 'css')
              .map((file) => file.relativePath)
          ),
          body: content
        })
      )
    )
  )
}
