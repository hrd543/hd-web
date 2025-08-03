import {
  SiteFunction,
  validateConfig,
  type BuildSiteConfig,
  Build
} from '@hd-web/build'
import * as esbuild from 'esbuild'
import path from 'path'
import fs from 'fs/promises'
import { readMetafile } from './utils.js'

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never

/**
 * Create the html, css and js files for an hd-web site using esbuild
 */
export const plugin = (
  site: SiteFunction,
  rawConfig: Partial<BuildSiteConfig> = {}
): esbuild.Plugin => ({
  name: 'hd-web-plugin',
  async setup(build) {
    const config = validateConfig(rawConfig)
    const outFile = path.join(config.out, 'main.js')

    await Build.initialise(config)

    let pages: Unpromise<ReturnType<typeof Build.start>> = []

    build.onStart(async () => {
      pages = await Build.start(config, site)
    })

    build.onEnd(async (result) => {
      await Build.end(config, pages, readMetafile(result.metafile!, config.out))
    })

    build.onDispose(() => {
      pages = []
    })

    if (!config.dev) {
      build.onLoad({ filter: /\.tsx$/ }, async (args) => {
        return {
          contents: await Build.load(
            config,
            await fs.readFile(args.path, 'utf8')
          ),
          loader: 'tsx'
        }
      })
    }

    build.initialOptions.entryPoints = [outFile]
    build.initialOptions.outdir = config.out
    build.initialOptions.allowOverwrite = true
    build.initialOptions.treeShaking = true
    build.initialOptions.bundle = true
    build.initialOptions.metafile = true
  }
})
