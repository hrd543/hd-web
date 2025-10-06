import './Home.css'

import { Meta } from '@hd-web/components/head'
import { Page } from 'hd-web'

import { BlogData } from '../../blogs/index.js'
import { PageLayout } from '../../shared/PageLayout.js'
import { BlogPage } from '../Blog/BlogPage.js'
import { Contact } from '../Contact/Contact.js'
import h from './h.jpg'
import { Image } from '@hd-web/files'

export const Home: Page<BlogData> = {
  title: 'Hd-web site',
  head: () => <Meta />,
  content: () => (
    <PageLayout>
      <div class="Home">Welcome to hd web</div>
      <Image src={h} alt="" quality={100} />
    </PageLayout>
  ),
  routes: {
    contact: Contact,
    blog: BlogPage
  }
}
