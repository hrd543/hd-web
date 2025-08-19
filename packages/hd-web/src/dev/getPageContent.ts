import { BuiltPage } from '../shared/index.js'

const findPage = (url: string, pages: BuiltPage[]) => {
  const formattedUrl = url.slice(1)

  return pages.find((p) => p[0] === formattedUrl)
}

export const getPageContent = async (
  url: string,
  getSite: () => Promise<BuiltPage[] | null>
) => {
  const site = await getSite()

  if (site === null) {
    return null
  }

  const page = findPage(url, site)

  if (!page) {
    return undefined
  }

  return page[1]
}
