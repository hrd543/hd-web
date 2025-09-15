import { Page, PageContent } from 'hd-web'

import { type Blog, BlogData, buildBlogUrl } from '../../blogs/index.js'
import { PageLayout } from '../../shared/PageLayout.js'
import { BlogPostPage } from './BlogPost.js'

const BlogPageBody: PageContent<BlogData> = ({ siteData: { blogs } }) => (
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
  // Using a function to define the routes means you can access
  // the blog data to generate your subroutes.
  routes: ({ blogByLink }) => {
    const pages: Record<string, Page<BlogData, Blog>> = {}

    for (const link in blogByLink) {
      pages[link] = BlogPostPage
    }

    return pages
  }
}
