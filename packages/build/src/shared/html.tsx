import { renderToString } from '@hd-web/jsx'
import path from 'path'

/**
 * Build the full html content given the site information and
 * script/styling file locations.
 */
export const buildHtmlHead = (
  head: string,
  scripts: string[],
  styles: string[]
): string => {
  const main = (
    <head>
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
