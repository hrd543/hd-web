import { BuildSiteConfig } from '@hd-web/build'
import * as esbuild from 'esbuild'
import { defaultEsbuildOptions } from './defaults.js'
import { hdWebPlugin } from './index.js'

export const build = async (config: Partial<BuildSiteConfig> = {}) =>
  await esbuild.build({
    ...defaultEsbuildOptions,
    target: 'es6',
    minify: true,
    treeShaking: true,
    plugins: [hdWebPlugin(config)]
  })
