import { FuncComponent, Page } from 'hd-web'

import { type Blog, BlogData, buildBlogUrl } from '../../blogs/index.js'
import { PageLayout } from '../../shared/PageLayout.js'
import { BlogPostPage } from './BlogPost.js'

const BlogPageBody: FuncComponent<{ data: BlogData }> = ({
  data: { blogs }
}) => (
  <PageLayout>
    <h1>Blog posts</h1>
    {blogs.map((b) => (
      <li>
        <a href={`/blog/${buildBlogUrl(b.title)}`}>{b.title}</a>
      </li>
    ))}
  </PageLayout>
)

export const BlogPage: Page<BlogData> = {
  title: 'Blog',
  content: BlogPageBody,
  routes: ({ blogByLink }) => {
    const pages: Record<string, Page<BlogData, Blog>> = {}

    for (const link in blogByLink) {
      pages[link] = BlogPostPage
    }

    return pages
  }
}
