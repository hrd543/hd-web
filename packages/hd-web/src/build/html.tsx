import { HdNode } from '@hd-web/jsx'
import fs from 'fs/promises'
import path from 'path'

import { buildHtml, BuiltPage, createMeta } from '../shared/index.js'
import { ComponentInfo } from '../stringify/index.js'
import { BuildConfig } from './config.js'
import { BuiltFile } from './types.js'
import { getFileType } from './utils.js'

/**
 * Create the html file for the page, including
 * the styles, js and assets needed for the site.
 */
export const buildHtmlFiles = async (
  pages: BuiltPage[],
  { lang, write, out }: BuildConfig,
  scripts: HdNode
): Promise<{
  html: BuiltFile[]
  components: ComponentInfo[]
}> => {
  const html: BuiltFile[] = []
  const components: ComponentInfo[] = []

  pages.forEach(([p, { title, description, head, body }]) => {
    const built = buildHtml(
      createMeta(title, description, head(), scripts),
      body(),
      lang
    )

    html.push({
      path: path.join(out, p),
      relativePath: p,
      type: getFileType(p),
      contents: built.html
    })
    components.push(...built.components)
  })

  if (write) {
    await Promise.all(
      html.map(async (h) => {
        const dirname = path.dirname(h.path)
        await fs.mkdir(dirname, { recursive: true })
        await fs.writeFile(h.path, h.contents!)
      })
    )
  }

  return {
    html,
    components
  }
}

export const getScriptElements = (files: BuiltFile[]): HdNode => {
  const scripts = files
    .filter((file) => file.type === 'js')
    .map((file) => file.relativePath)
  const styles = files
    .filter((file) => file.type === 'css')
    .map((file) => file.relativePath)

  return [
    scripts.map((script) => <script type="module" src={`/${script}`} />),
    styles.map((style) => <link rel="stylesheet" href={`/${style}`} />)
  ]
}

/**
 * Get the filepath for the html file created for pagePath.
 *
 * If createFolder is true, then uses `path/index.html`, otherwise,
 * use path.html
 */
export const getHtmlFilepath = (page: BuiltPage): BuiltPage => {
  const [pagePath, content, createFolder] = page

  const newPath = createFolder
    ? path.join(pagePath, 'index.html')
    : pagePath.replace(/[\\/]$/, '') + '.html'

  return [newPath, content, createFolder]
}
