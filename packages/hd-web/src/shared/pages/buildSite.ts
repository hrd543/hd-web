import { SharedConfig } from '../sharedConfig.js'
import { buildPages } from './buildPages.js'
import { BuiltSite, Site } from './types.js'

export const buildSite = async <T>(
  site: Site<T>,
  config: SharedConfig
): Promise<BuiltSite<T>> => {
  const data = (await site.getSiteData?.()) as T

  return {
    head: site.head,
    data,
    pages: buildPages(site.root, data, config.joinTitles)
  }
}
