import { Site, SubPage } from '../types/index.js'

export const getPage = async (url: string, site: Site | undefined) => {
  const paths = url.slice(1).split('/')

  let found: Site | SubPage | undefined = site

  while (found && paths.length) {
    const route = paths.shift()
    if (!route) {
      break
    }

    found = await found.routes?.[route]?.()
  }

  return found
}
