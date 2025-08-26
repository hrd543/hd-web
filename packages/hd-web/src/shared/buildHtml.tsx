import { HdNode } from '@hd-web/jsx'
import { stringifyNode } from '../stringify/index.js'

/**
 * Build the full html content from its head and body
 */
export const buildHtml = (head: HdNode, body: HdNode, lang: string) => {
  const htmlElement = (
    <html lang={lang}>
      <head>{head}</head>
      <body>{body}</body>
    </html>
  )

  const { html, components } = stringifyNode(htmlElement)

  return {
    html: `<!DOCTYPE html>${html}`,
    components
  }
}
