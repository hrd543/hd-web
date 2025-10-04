import * as esbuild from 'esbuild'

import { DevConfig } from './config.js'
import { buildSite, BuiltSite } from '../shared/index.js'
import { getSite } from './getSite.js'

type RebuildResult = {
  site: BuiltSite
  css: string
}

export const devPlugin = (config: DevConfig) => {
  let resolve: ((r: RebuildResult | null) => void) | undefined
  // Once done, we store the result here
  let result: RebuildResult | null
  let id = -1

  const plugin: esbuild.Plugin = {
    name: 'hd-web-dev-plugin',
    setup(build) {
      build.onStart(async () => {
        id++
        result = null

        return {
          warnings: [{ text: 'buildId', detail: id }]
        }
      })

      build.onEnd(async (first) => {
        console.log(first.warnings, id)
        const buildId = first.warnings.find((x) => x.text === 'buildId')!.detail

        if (buildId !== id) {
          return
        }

        id = -1

        const outfile = first.outputFiles!.find((f) =>
          f.path.endsWith('.js')
        )!.path
        const css = first.outputFiles!.find((f) =>
          f.path.endsWith('.css')
        )!.text

        // TODO make these functions sync.
        // Pull out data into some separate thing which can be cached?
        const site = await buildSite(
          await getSite(outfile, first.outputFiles),
          config
        )

        const newResult = {
          site,
          css
        }

        await new Promise((r) => setTimeout(r, 10 * 1000))

        result = newResult
        resolve?.(newResult)
        resolve = undefined
      })
    }
  }

  const getResult = async () => {
    resolve?.(null)

    if (result) {
      return result
    }

    return new Promise<RebuildResult | null>((res) => {
      resolve = res
    })
  }

  return {
    plugin,
    getResult
  }
}
