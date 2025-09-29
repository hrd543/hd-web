import type { HdConfig, Plugin } from 'hd-web'

import {
  buildFileTypeRegex,
  imageFileTypes,
  removeFilesFromList
} from './imageFileTypes.js'
import { resolveCallback } from './resolve.js'
import { loadCallback } from './load.js'
import { onBuildEnd, onBuildStart } from './buildCallbacks.js'

export const plugin = (fileTypes = imageFileTypes): Plugin<HdConfig> => {
  const filterRegex = buildFileTypeRegex(fileTypes)

  return {
    name: 'hd-plugin-images',
    onBuildStart,
    onBuildEnd,

    // Don't let the builder handle these images
    modifyConfig(config) {
      return {
        ...config,
        fileTypes: removeFilesFromList(fileTypes, config.fileTypes)
      }
    },

    onResolve: {
      filter: filterRegex,
      resolve: resolveCallback
    },

    onLoad: {
      filter: filterRegex,
      load: loadCallback
    }
  }
}
