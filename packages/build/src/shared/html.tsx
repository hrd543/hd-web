import { JSX, renderToString } from '@hd-web/jsx'
import path from 'path'

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
export const getHtmlFilepath = (pagePath: string, createFolder: boolean) => {
  if (createFolder) {
    return path.join(pagePath, 'index.html')
  }

  // Replace any trailing slashes and add a .html extension
  return pagePath.replace(/[\\/]$/, '') + '.html'
}
