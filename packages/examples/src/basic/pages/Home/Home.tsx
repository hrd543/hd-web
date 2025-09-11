import './Home.css'

import { Meta } from '@hd-web/components/head'
import { SiteFunction } from 'hd-web'

import { getBlogs } from '../../blogs/index.js'
import { PageLayout } from '../../shared/PageLayout.js'
import { BlogPage } from '../Blog/BlogPage.js'
import { Contact } from '../Contact/Contact.js'

export const Home: SiteFunction = async () => {
  const blogs = await getBlogs()

  return {
    title: 'Hd-web site',
    head: () => <Meta />,
    body: () => (
      <PageLayout>
        <div class="Home">Welcome to hd web</div>
      </PageLayout>
    ),
    routes: {
      contact: Contact,
      blog: BlogPage(blogs)
    }
  }
}
