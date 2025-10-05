import type { Plugin } from 'esbuild'

import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'
import { resolveCallback } from './resolve.js'
import { loadCallback } from './load.js'
import { onBuildEnd, onBuildStart } from './buildCallbacks.js'

export const plugin = (fileTypes = imageFileTypes): Plugin => {
  const filterRegex = buildFileTypeRegex(fileTypes)

  return {
    name: 'hd-plugin-images',
    setup(build) {
      build.onStart(() => onBuildStart(build.initialOptions.write))

      build.onEnd(() =>
        onBuildEnd(build.initialOptions.outdir!, build.initialOptions.write)
      )

      build.onResolve({ filter: filterRegex }, resolveCallback)

      build.onLoad({ filter: filterRegex }, loadCallback)
    }
  }
}
