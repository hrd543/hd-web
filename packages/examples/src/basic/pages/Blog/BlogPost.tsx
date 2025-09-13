import type { FuncComponent, Page } from 'hd-web'

import { Blog, BlogData } from '../../blogs/index.js'
import { PageLayout } from '../../shared/index.js'

const BlogPost: FuncComponent<{ blog: Blog }> = ({ blog }) => {
  return (
    <PageLayout>
      <h1>{blog.title}</h1>
      {blog.content()}
    </PageLayout>
  )
}

export const BlogPostPage: Page<BlogData, Blog> = {
  title: (blog) => blog.title,
  content: ({ props: blog }) => <BlogPost blog={blog} />,
  // This means we can pass the exact blog to each page's content
  // while using the same component for each page
  props: (data, path) => {
    const blogId = path.at(-1)!

    return data.blogByLink[blogId]!
  }
}
