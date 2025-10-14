import { HdNode } from '@hd-web/jsx'

import { stringifyNode } from '../stringify/index.js'

/**
 * Build the full html content from its head and body
 */
export const buildHtml = async (
  head: HdNode,
  body: HdNode,
  lang: string,
  dev: boolean
) => {
  const htmlElement = (
    <html lang={lang}>
      <head>{head}</head>
      <body>{body}</body>
    </html>
  )

  const { html, components } = await stringifyNode(htmlElement, dev)

  return {
    html: `<!DOCTYPE html>${html}`,
    components
  }
}
