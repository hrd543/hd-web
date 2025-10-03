import { readMdFile, readMdGlob } from '@hd-web/md-content'
import { buildBlogUrl } from './buildBlogUrl.js'
import { first } from './first.js'
import { second } from './second.js'
import { Blog } from './types.js'

const blogs = [first, second]

export type BlogData = {
  blogs: Blog[]
  blogByLink: Record<string, Blog>
}

// You could fetch this information from an api
// or use some sort of fs.readDir approach instead
export const getBlogData = async (): Promise<BlogData> => {
  const x = (await import('glob:./md/*.md')).default
  console.log(x)

  return {
    blogs: [...blogs],
    x: 1,
    blogByLink: blogs.reduce(
      (all, b) => ({ ...all, [buildBlogUrl(b.title)]: b }),
      {}
    )
  }
}
