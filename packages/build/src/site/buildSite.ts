import { initialiseGlobals } from './globals.js'
import { removeUnusedCode } from './removeUnusedCode.js'
import { writeToHtml } from './writeToHtml.js'
import { buildFile, defaultConfig } from './constants.js'
import * as path from 'path'
import { validatePages } from './validatePages.js'
import { getActivePages } from './getActivePages.js'
import { processJs } from './processJs.js'
import { getPageBuilders } from './getPageBuilders.js'

export const buildSite = async (entryDir: string, outDir: string) => {
  if (entryDir === outDir) {
    throw new Error("Can't have input the same as output")
  }

  // Need to define the global types BEFORE importing the component
  const getCustomElements = initialiseGlobals()
  const outFile = path.resolve(outDir, buildFile)

  const activePages = await getActivePages(entryDir)
  const pageBuilders = await getPageBuilders(entryDir, outFile, activePages)

  const [htmlContents] = await Promise.all([
    await validatePages(pageBuilders, activePages),
    await processJs(outFile, getCustomElements)
  ])

  await Promise.all([
    await removeUnusedCode(outFile, defaultConfig),
    await writeToHtml(activePages, htmlContents, entryDir, outDir)
  ])
}
