import { HdPlugin } from './types.js'

export const filterPlugins = <T>(
  plugins: Array<HdPlugin<T>>,
  type: HdPlugin<T>['apply']
) => plugins.filter((p) => p.apply === undefined || p.apply === type)
