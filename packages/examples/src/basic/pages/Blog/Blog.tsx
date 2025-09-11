import { SubPageFunction } from 'hd-web'

import { type BlogPost, buildBlogUrl } from '../../blogs/index.js'
import { PageLayout } from '../../shared/PageLayout.js'

export const Blog =
  (blogs: BlogPost[]): SubPageFunction =>
  () => ({
    title: 'Blog',
    body: () => (
      <PageLayout>
        <h1>Blog posts</h1>
        {blogs.map((b) => (
          <li>
            <a href={`/blog/${buildBlogUrl(b.title)}`}>{b.title}</a>
          </li>
        ))}
      </PageLayout>
    ),
    routes: blogs.reduce(
      (all, b) => {
        all[buildBlogUrl(b.title)] = () => ({
          body: () => b.content(),
          title: b.title
        })

        return all
      },
      {} as Record<string, SubPageFunction>
    )
  })
