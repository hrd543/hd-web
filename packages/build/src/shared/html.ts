import * as fs from 'fs/promises'
import path from 'path'

export const getCssPathFromJs = (jsPath: string) => {
  return jsPath.replace(/\.js$/, '.css')
}

export const buildScriptElements = (scripts: string[]) =>
  scripts
    .map((script) => `<script type="module" src="/${script}"></script>`)
    .join('\n')

export const buildStyleElements = (styles: string[]) =>
  styles.map((style) => `<link rel="stylesheet" href="/${style}" />`).join('\n')

/**
 * Go through str and replace all instances of %hd-web-x% with the corresponding
 * replacement.
 * If there are 0 or multiple counts for any, throw an error.
 */
export const replaceHtml = (
  str: string,
  replacements: Record<string, string>
) => {
  const keys = Object.keys(replacements)
  const counts = keys.reduce<Record<string, number>>((all, key) => {
    all[key] = 0

    return all
  }, {})

  const replaced = str.replace(
    new RegExp(`%hd-web-(${keys.join('|')})%`, 'g'),
    (match, type) => {
      counts[type]!++

      return replacements[type]!
    }
  )

  const errors = keys.reduce<string[]>((all, key) => {
    if (counts[key]! !== 1) {
      all.push(key)
    }

    return all
  }, [])

  if (errors.length) {
    throw new Error(
      `Found 0 or multiple %hd-web% tags for ${errors.join(', ')}`
    )
  }

  return replaced
}

export const getHtmlTemplate = async (dir: string) => {
  return await fs.readFile(path.resolve(dir, 'index.html'), 'utf-8')
}

export const getHtmlFile = (is404?: boolean) =>
  is404 ? '404.html' : 'index.html'
