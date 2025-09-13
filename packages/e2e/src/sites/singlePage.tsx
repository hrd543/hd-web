import { Site } from 'hd-web'

const singlePage: Site = {
  root: {
    title: 'Single page site',
    content: () => <div id="content">Single page site body</div>
  },
  head: () => <meta id="head" name="test" />
}

export default singlePage
