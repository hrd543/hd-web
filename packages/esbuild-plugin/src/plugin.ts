import { validateConfig, type BuildSiteConfig, Build } from '@hd-web/build'
import * as esbuild from 'esbuild'
import { readMetafile } from './utils.js'

/**
 * Create the html, css and js files for an hd-web site using esbuild.
 *
 * Direct use of this plugin should be avoided in favour of the build and
 * dev functions since not all of the esbuild options have been tested.
 */
export const plugin = (
  rawConfig: Partial<BuildSiteConfig> = {}
): esbuild.Plugin => ({
  name: 'hd-web-plugin',
  async setup(build) {
    const config = validateConfig(rawConfig)
    // TODO: Move shared options into own config and pass into transform
    const target = build.initialOptions.target
    const minify = build.initialOptions.minify

    await Build.initialise(config)

    build.onStart(async () => {
      await Build.start()
    })

    build.onEnd(async (result) => {
      await Build.end(
        config,
        readMetafile(result.metafile!, config.out),
        async (code) =>
          (
            await esbuild.transform(code, {
              treeShaking: true,
              minify,
              target
            })
          ).code
      )
    })

    build.onDispose(async () => {
      await Build.dispose(config)
    })

    build.initialOptions.entryPoints = [config.entry]
    build.initialOptions.outdir = config.out
    build.initialOptions.allowOverwrite = true
    build.initialOptions.treeShaking = true
    build.initialOptions.bundle = true
    build.initialOptions.metafile = true
    // Need this to make sure decorators are maintained
    build.initialOptions.target = 'esnext'
  }
})
