import './defaults.css'
import './variables.css'
import './utils.css'
import './fonts.css'
import { SiteFunction } from 'hd-web'
import { Meta } from '@hd-web/components/head'
import { NotFound } from '@hd-web/components/global'

// This is your page's html
const App: SiteFunction = () => ({
  body: () => <div>Hello world!</div>,
  title: 'My new site!',
  description: 'My awesome new site made with hd-web',
  head: () => <Meta />,
  routes: {
    404: () => ({
      title: 'Not found',
      body: () => <NotFound />
    })
  }
})

export default App
