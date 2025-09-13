import './main.css'
import './variables.css'

import { Meta } from '@hd-web/components/head'
import { Site } from 'hd-web'

import { BlogData, getBlogData } from './blogs/index.js'
import { Home } from './pages/Home/Home.js'

const site: Site<BlogData> = {
  root: Home,
  head: Meta,
  getData: getBlogData
}

export default site
