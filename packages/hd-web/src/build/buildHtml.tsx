import { stringifyNode, ComponentInfo } from '../stringify/index.js'
import path from 'path'
import fs from 'fs/promises'
import { BuiltFile, BuiltPage } from './types.js'
import { BuildSiteConfig } from './config.js'
import { HdNode } from '@hd-web/jsx'

/**
 * Create the html file for the page, including
 * the styles, js and assets needed for the site.
 */
export const writeToHtml = async (
  [p, content, hasChildren]: BuiltPage,
  { lang, out }: BuildSiteConfig,
  built: BuiltFile[]
): Promise<ComponentInfo[]> => {
  // Create a directory for each page which needs it
  if (hasChildren) {
    await fs.mkdir(path.join(out, p), { recursive: true })
  }

  const { html, components } = buildHtml(
    addMetaToHead(content, built),
    content.body(),
    lang
  )

  await fs.writeFile(getHtmlFilepath(path.join(out, p), hasChildren), html)

  return components
}

/**
 * Add the script and style files to the html head element, as well
 * as meta tags for its title / description
 */
const addMetaToHead = (
  { title, description, head }: BuiltPage[1],
  files: BuiltFile[]
): HdNode => {
  const scripts = files
    .filter((file) => file.type === 'js')
    .map((file) => file.relativePath)
  const styles = files
    .filter((file) => file.type === 'css')
    .map((file) => file.relativePath)

  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {head()}
      <>
        {scripts.map((script) => (
          <script type="module" src={`/${script}`} />
        ))}
      </>
      <>
        {styles.map((style) => (
          <link rel="stylesheet" href={`/${style}`} />
        ))}
      </>
    </>
  )
}

/**
 * Build the full html content from its head and body
 */
const buildHtml = (head: HdNode, body: HdNode, lang: string) => {
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

/**
 * Get the filepath for the html file created for pagePath.
 *
 * If createFolder is true, then uses `path/index.html`, otherwise,
 * use path.html
 */
const getHtmlFilepath = (pagePath: string, createFolder: boolean) => {
  if (createFolder) {
    return path.join(pagePath, 'index.html')
  }

  // Replace any trailing slashes and add a .html extension
  return pagePath.replace(/[\\/]$/, '') + '.html'
}
