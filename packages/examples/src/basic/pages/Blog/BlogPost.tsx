import { Meta } from '@hd-web/components/head'
import type { Page, PageContent } from 'hd-web'

import { Blog, BlogData } from '../../blogs/index.js'
import { PageLayout } from '../../shared/index.js'

const BlogPost: PageContent<BlogData, Blog> = ({ pageData: blog }) => {
  return (
    <PageLayout>
      <h1>{blog.title}</h1>
      {blog.content()}
    </PageLayout>
  )
}

export const BlogPostPage: Page<BlogData, Blog> = {
  title: (blog) => blog.title,
  content: BlogPost,

  // Override the default head information to provide context
  // when our blog post is shared via a link
  head: ({ pageData: blog }) => (
    <>
      <Meta />
      <meta property="og:title" content={blog.title} />
      <meta property="og:type" content="article" />
    </>
  ),

  // This means we can pass the exact blog to each page's content
  // while using the same component for each page
  getPageData: (data, path) => {
    const blogId = path.at(-1)!

    return data.blogByLink[blogId]!
  }
}
