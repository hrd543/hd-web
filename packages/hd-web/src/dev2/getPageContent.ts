import { BuiltPage } from '../shared/index.js'

const findPage = (url: string, pages: BuiltPage[]) => {
  const formattedUrl = url.slice(1)

  return pages.find((p) => p[0] === formattedUrl)
}

export const getPageContent = (url: string, pages: BuiltPage[]) => {
  const page = findPage(url, pages)

  if (!page) {
    return undefined
  }

  return page[1]
}
