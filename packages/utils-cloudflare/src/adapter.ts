import fs from 'fs/promises'
import path from 'path'
import * as esbuild from 'esbuild'
import type { Adapter } from '@hd-web/build'

/**
 * Use this adapter to make your build compatible with cloudflare
 * pages.
 * All functions located in apiFolder will be used as the "functions"
 * directory and run in a worker: they will be added to a functions
 * folder located at root.
 *
 * You will end up with a worker at example.com/api
 */
export const adapterCloudflare = (apiFolder = 'src/api'): Adapter => ({
  after: async (out: string) => {
    // First delete the functions folder if it exists
    await fs.rm('functions', { recursive: true, force: true })

    // Then find all files in the apiFolder
    const contents = (
      await fs.readdir(apiFolder, { recursive: true, withFileTypes: true })
    )
      // Now filter out to only include js/ts files
      .filter((dirent) => {
        if (!dirent.isFile()) {
          return false
        }

        const ext = path.extname(dirent.name)

        return ext === '.ts' || ext === '.js'
      })

    // Now build each of these files and place them in the functions
    // folder within outFolder.
    // We place all functions within an api folder so that the request must
    // be made to example.com/api/...
    for (const file of contents) {
      await esbuild.build({
        entryPoints: [path.join(file.parentPath, file.name)],
        outfile: path.join(
          'functions/api',
          path.relative(apiFolder, file.parentPath),
          file.name
        ),
        target: 'esnext',
        format: 'esm',
        bundle: true,
        minify: true,
        treeShaking: true
      })
    }

    // Finally we need to make a _routes.json file so that we only invoke
    // the worker for api calls.
    await fs.writeFile(
      path.join(out, '_routes.json'),
      `
      {
        "version": 1,
        "include": ["/api/*"],
        "exclude": []
      }
    `
    )
  }
})
