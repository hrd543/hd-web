import { FuncComponent, SubPageFunction } from 'hd-web'

import { type Blog, buildBlogUrl } from '../../blogs/index.js'
import { PageLayout } from '../../shared/PageLayout.js'
import { BlogPost } from './BlogPost.js'

export const BlogPage =
  (blogs: Blog[]): SubPageFunction =>
  () => ({
    title: 'Blog',
    body: () => <BlogPageBody blogs={blogs} />,
    routes: getBlogRoutes(blogs)
  })

const BlogPageBody: FuncComponent<{ blogs: Blog[] }> = ({ blogs }) => (
  <PageLayout>
    <h1>Blog posts</h1>
    {blogs.map((b) => (
      <li>
        <a href={`/blog/${buildBlogUrl(b.title)}`}>{b.title}</a>
      </li>
    ))}
  </PageLayout>
)

const getBlogRoutes = (blogs: Blog[]): Record<string, SubPageFunction> =>
  blogs.reduce(
    (all, b) => {
      all[buildBlogUrl(b.title)] = () => ({
        body: () => <BlogPost blog={b} />,
        title: b.title
      })

      return all
    },
    {} as Record<string, SubPageFunction>
  )
