import './main.css'
import './variables.css'

import { Meta } from '@hd-web/components/head'
import { Site } from 'hd-web'

import { BlogData, getBlogData } from './blogs/index.js'
import { Home } from './pages/Home/Home.js'

const site: Site<BlogData> = {
  root: Home,
  head: Meta,
  /*
  This simulates fetching the blog data from an external api
  and is a nice way to integrate all blogs into each page.

  You could also just make each page a function which returns
  the necessary json, taking blogs as a prop.
  However, this becomes harder to read and test, and will also
  end up being less performant. Especially since hd-web can cache
  these data calls.
  */
  getSiteData: getBlogData
}

export default site
