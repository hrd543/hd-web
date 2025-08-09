import { BuildSiteConfig } from './config.js'
import fs from 'fs/promises'
import { buildPages } from './pages.js'
import { BuiltFile, writeToHtml } from './html.js'
import { transformBuiltJs } from './removeDecorators.js'
import { importSite } from './importSite.js'
import { getClientCode } from './client.js'

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
export const start = async () => {
  console.log('Bundling js...')
}

/**
 * Callback to be run at the end of every build
 */
export const end = async (
  config: BuildSiteConfig,
  files: BuiltFile[],
  /**
   * Use this to do any last alterations to the js file.
   *
   * For example to remove dead code.
   */
  processJs: (code: string) => Promise<string>
) => {
  console.log('Building html...')
  // TODO: If we support splitting, this might need to change
  const entry = files.find((f) => f.type === 'js')!.path

  const site = await importSite(entry)
  const pages = await buildPages(site, config.joinTitles)
  await writeToHtml(pages, config, files)

  console.log('Processing js...')
  const code = await fs.readFile(entry, { encoding: 'utf-8' })

  await fs.writeFile(
    entry,
    await processJs(
      transformBuiltJs(code, config.dev) + ';' + getClientCode(pages)
    )
  )

  console.log('Done')
}

/**
 * Callback to be run at the end of the very last build
 */
export const dispose = async ({ out, dev }: BuildSiteConfig) => {
  if (dev) {
    await deleteFolder(out)
  }
  console.log('Disposed')
}
