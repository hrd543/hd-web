import type { JSX } from '@hd-web/jsx'
import { Site } from './types.js'
import path from 'path'

export const getCssPathFromJs = (jsPath: string) => {
  return jsPath.replace(/\.js$/, '.css')
}

/**
 * Build the full html content given the site information and
 * script/styling file locations.
 */
export const buildHtml = (
  html: Site,
  lang: string,
  scripts: string[],
  styles: string[]
): string => {
  const main: JSX.Element = (
    <html lang={lang}>
      <head>
        <title>{html.title}</title>
        {html.description ? (
          <meta name="description" content={html.description} />
        ) : null}
        {html.head}
        {scripts.map((script) => (
          <script type="module" src={`/${script}`} />
        ))}
        {styles.map((style) => (
          <link rel="stylesheet" href={`/${style}`} />
        ))}
      </head>
      <body>{html.body}</body>
    </html>
  )

  return `<!DOCTYPE html>${main}`
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
