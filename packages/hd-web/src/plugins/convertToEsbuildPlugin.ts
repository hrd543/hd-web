import * as esbuild from 'esbuild'

import { Plugin } from './types.js'

export const convertToEsbuildPlugin =
  <T>(config: T) =>
  (plugin: Plugin<T>): esbuild.Plugin => {
    return {
      name: plugin.name,
      setup: (build) => plugin.bundleSetup?.(build, config)
    }
  }
