import type { FuncComponent } from 'hd-web'

import { Blog } from '../../blogs/index.js'
import { PageLayout } from '../../shared/index.js'

export const BlogPost: FuncComponent<{ blog: Blog }> = ({ blog }) => {
  return (
    <PageLayout>
      <h1>{blog.title}</h1>
      {blog.content()}
    </PageLayout>
  )
}
