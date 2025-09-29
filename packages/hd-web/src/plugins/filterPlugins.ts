import { Plugin } from './types.js'

export const filterPlugins = <T>(
  plugins: Array<Plugin<T>>,
  type: Plugin<T>['apply']
) => plugins.filter((p) => p.apply === undefined || p.apply === type)
