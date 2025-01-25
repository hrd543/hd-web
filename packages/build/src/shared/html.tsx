import type { JSX } from '@hd-web/jsx'
import { Site } from './types.js'
import path from 'path'

export const getCssPathFromJs = (jsPath: string) => {
  return jsPath.replace(/\.js$/, '.css')
}

export const buildHtml = (
  html: Site,
  scripts: string[],
  styles: string[]
): string => {
  const main: JSX.Element = (
    <html>
      <head>
        <title>{html.title}</title>
        <meta name="description" content={html.description} />
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

export const getHtmlFilepath = (pagePath: string, createFolder: boolean) => {
  if (createFolder) {
    return path.join(pagePath, 'index.html')
  }

  // Replace any trailing slashes and add a .html extension
  return pagePath.replace(/[\\/]$/, '') + '.html'
}
