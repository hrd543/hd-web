import { BuildSiteConfig } from './config.js'
import path from 'path'
import fs from 'fs/promises'
import { buildPages } from './pages.js'
import { BuiltPage } from './types.js'
import { getClientCode } from './client.js'
import { BuiltFile, writeToHtml } from './html.js'
import { removeDecorators } from './removeDecorators.js'
import { importSite } from './importSite.js'

const deleteFolder = async (folder: string) => {
  await fs.rm(folder, { recursive: true, force: true })
}

/**
 * Callback to be run at the start of the very first build.
 */
export const initialise = async ({ out, staticFolder }: BuildSiteConfig) => {
  console.log('Initialising...')
  await deleteFolder(out)
  await fs.mkdir(out)

  // Copy over any static assets
  if (staticFolder) {
    await fs.cp(staticFolder, out, { recursive: true })
  }
}

/**
 * Callback to be run at the start of every build
 */
export const start = async ({ out, joinTitles, entry }: BuildSiteConfig) => {
  console.log('Building...')

  const site = await importSite(entry)
  const pages = await buildPages(site, joinTitles)
  await fs.writeFile(path.join(out, 'main.js'), getClientCode(pages))

  return pages
}

/**
 * Callback to be run at the end of every build
 */
export const end = async (
  config: BuildSiteConfig,
  pages: BuiltPage[],
  files: BuiltFile[]
) => {
  await writeToHtml(pages, config, files)
  console.log('Done')
}

/**
 * Callback to be run at the end of the very last build
 */
export const dispose = async ({ out }: BuildSiteConfig) => {
  await deleteFolder(out)
  console.log('Disposed')
}

/**
 * Callback to be run when loading each tsx file
 */
export const load = async (config: BuildSiteConfig, code: string) => {
  if (config.dev) {
    return code
  }

  return await removeDecorators(code)
}
