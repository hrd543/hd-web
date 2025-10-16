import type { Plugin } from 'hd-web'

import { buildFileTypeRegex } from './fileTypes.js'
import { resolveCallback } from './resolve.js'
import { loadCallback } from './load.js'
import { onBuildEnd, onBuildStart } from './buildCallbacks.js'
import { PluginOptions } from './options.js'

export const plugin = (options: PluginOptions): Plugin => {
  const filterRegex = buildFileTypeRegex(options.fileTypes)

  return {
    name: 'hd-plugin-files',
    bundleSetup(build) {
      build.onResolve({ filter: filterRegex }, resolveCallback)

      build.onLoad({ filter: filterRegex }, loadCallback)
    },

    async onPageStart(config) {
      await onBuildStart(config.write, config.out)
    },

    onPageEnd() {
      onBuildEnd()
    }
  }
}
