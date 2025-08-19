import { ComponentInfo } from '../stringify/index.js'
import path from 'path'
import fs from 'fs/promises'
import { BuiltFile } from './types.js'
import { BuildConfig } from './config.js'
import { HdNode } from '@hd-web/jsx'
import { buildHtml, createMeta, BuiltPage } from '../shared/index.js'

/**
 * Create the html file for the page, including
 * the styles, js and assets needed for the site.
 */
export const writeToHtml = async (
  [p, { title, description, head, body }, hasChildren]: BuiltPage,
  { lang, out }: BuildConfig,
  built: BuiltFile[]
): Promise<ComponentInfo[]> => {
  // Create a directory for each page which needs it
  if (hasChildren) {
    await fs.mkdir(path.join(out, p), { recursive: true })
  }

  const { html, components } = buildHtml(
    createMeta(title, description, head(), getScriptElements(built)),
    body(),
    lang
  )

  await fs.writeFile(getHtmlFilepath(path.join(out, p), hasChildren), html)

  return components
}

const getScriptElements = (files: BuiltFile[]): HdNode => {
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
const getHtmlFilepath = (pagePath: string, createFolder: boolean) => {
  if (createFolder) {
    return path.join(pagePath, 'index.html')
  }

  // Replace any trailing slashes and add a .html extension
  return pagePath.replace(/[\\/]$/, '') + '.html'
}
