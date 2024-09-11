import * as fs from 'fs/promises'
import { defaultConfig } from '../shared/constants.js'
import * as esbuild from 'esbuild'
import { getImportPath } from '../getFilePath.js'
import { createEntryFile } from '../shared/js.js'

/**
 * Create a js file at out containing all code within activePages, relative
 * to the file at entry and default exporting each page's default export
 * as an array.
 *
 * Return the
 *
 * (Assumes activePages are already relative to entry)
 */
export const getPageBuilders = async (
  entryDir: string,
  out: string,
  activePages: string[],
  pageFilename: string
) => {
  const entry = await createEntryFile(entryDir, activePages, pageFilename)

  try {
    // Bundle all the js together. This needs to be done so that the
    // custom element names line up in the bundled code
    await esbuild.build({
      ...defaultConfig,
      entryPoints: [entry],
      outfile: out,
      // don't minify on the first pass to save time
      minify: false,
      // Use esm to preserve imports
      format: 'esm'
    })

    // Now import it and return the default export.
    return (await import(getImportPath(out))).default
  } finally {
    await fs.unlink(entry)
  }
}
