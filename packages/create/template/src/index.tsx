import './defaults.css'
import './variables.css'
import './utils.css'
import './fonts.css'

import { Meta } from '@hd-web/components/head'
import { Site } from 'hd-web'

import { Home } from './Home.js'

// This is your site definition
const site: Site = {
  root: Home,
  head: () => <Meta />
}

export default site
