import { JSX, renderToString, RenderToStringOutput } from '@hd-web/jsx'
import path from 'path'
import fs from 'fs/promises'
import { BuildSiteConfig } from '@hd-web/build'
import { BuiltFile, BuiltPage } from './types.js'

export const getFileType = (end: string): BuiltFile['type'] => {
  if (end.endsWith('.js') || end.endsWith('.ts')) {
    return 'js'
  }

  if (end.endsWith('.css')) {
    return 'css'
  }

  return 'file'
}

/**
 * Create all necessary html files for the build pages, including
 * the styles, js and assets needed for the site.
 */
export const writeToHtml = async (
  [p, content, hasChildren]: BuiltPage,
  { lang, out }: BuildSiteConfig,
  built: BuiltFile[]
): Promise<RenderToStringOutput['components']> => {
  // Create directories for each page which needs it
  if (hasChildren) {
    await fs.mkdir(path.join(out, p), { recursive: true })
  }

  // Create the index.html files by replacing the template with the necessary
  // content and script locations
  const filepath = getHtmlFilepath(path.join(out, p), hasChildren)
  console.log(content.head)

  const head = addMetaToHead(
    content.head(),
    content.title,
    content.description,
    built.filter((file) => file.type === 'js').map((file) => file.relativePath),
    built.filter((file) => file.type === 'css').map((file) => file.relativePath)
  )

  const { html: body, components } = renderToString(content.body())

  await fs.writeFile(filepath, buildHtml(head, body, lang))

  return components
}

/**
 * Add the script and style files to the html head element, as well
 * as meta tags for its title / description
 */
export const addMetaToHead = (
  head: JSX.Element,
  title: string,
  description: string | undefined,
  scripts: string[],
  styles: string[]
): string => {
  const main = (
    <head>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      {head}
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
    </head>
  )

  return renderToString(main).html
}

/**
 * Build the full html content from its head and body
 */
export const buildHtml = (head: string, body: string, lang: string) => {
  const html = (
    <html lang={lang}>
      {head}
      <body>{body}</body>
    </html>
  )

  return `<!DOCTYPE html>${renderToString(html).html}`
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
