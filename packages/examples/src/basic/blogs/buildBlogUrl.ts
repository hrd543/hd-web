import { cleanPath } from 'hd-web'

export const buildBlogUrl = (title: string) => {
  return encodeURI(cleanPath(title, true))
}
