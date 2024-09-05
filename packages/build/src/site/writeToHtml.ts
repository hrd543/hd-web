import * as fs from 'fs/promises'
import path from 'path'
import { buildFile } from './constants.js'

const getCssPathFromJs = (jsPath: string) => {
  return jsPath.replace(/\.js$/, '.css')
}

// exported for testing
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

/**
 * Using the template at html.entry, replace its body with htmlBody
 * and link the style and script tags appropriately.
 */
export const writeToHtml = async (
  pages: string[],
  htmlContents: string[],
  entryDir: string,
  outDir: string
) => {
  const htmlTemplate = await fs.readFile(
    path.resolve(entryDir, 'index.html'),
    'utf-8'
  )

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]!
    const content = htmlContents[i]!

    const newHtmlFile = replaceHtml(htmlTemplate, {
      script: `/${buildFile}`,
      css: getCssPathFromJs(`/${buildFile}`),
      body: content
    })

    await fs.mkdir(path.join(outDir, page), { recursive: true })
    await fs.writeFile(path.join(outDir, page, 'index.html'), newHtmlFile, {
      flag: ''
    })
  }
}
