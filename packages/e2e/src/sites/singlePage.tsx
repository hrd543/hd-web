import { SiteFunction } from 'hd-web'

const singlePage: SiteFunction = () => ({
  title: 'Single page site',
  body: () => <div id="content">Single page site body</div>,
  head: () => <meta id="head" name="test" />
})

export default singlePage
