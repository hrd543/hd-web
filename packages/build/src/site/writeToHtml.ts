import { buildFile } from '../shared/constants.js'
import {
  getCssPathFromJs,
  getHtmlTemplate,
  replaceHtml
} from '../shared/html.js'
import { createPageDirectories, createPages } from '../shared/pages.js'

/**
 * Using the template at html.entry, replace its body with htmlBody
 * and link the style and script tags appropriately.
 */
export const writeToHtml = async (
  pages: string[],
  htmlContents: string[],
  entryDir: string,
  outDir: string
) => {
  const htmlTemplate = await getHtmlTemplate(entryDir)
  const transformedContents = htmlContents.map((content) =>
    replaceHtml(htmlTemplate, {
      script: `/${buildFile}`,
      css: getCssPathFromJs(`/${buildFile}`),
      body: content
    })
  )

  await createPageDirectories(outDir, pages)
  await createPages(outDir, pages, transformedContents)
}
