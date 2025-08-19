import { BuiltPage } from '../shared/index.js'

export const getPage = (url: string, pages: BuiltPage[]) => {
  const formattedUrl = url.slice(1)

  return pages.find((p) => p[0] === formattedUrl)
}
