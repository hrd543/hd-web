import { Template, Component } from '@hd-web/jsx'
import Header from './Header.js'
import { SiteFunction } from '@hd-web/build'

const Logo = () => <div>henry</div>

@Template({
  render: () => (
    <div>
      <Header logo={<Logo />} items={[]} bgColour="" fontColour="" />
      <span>yoyo</span>
    </div>
  )
})
class Wrapper extends Component {
  init() {}
}

const A: SiteFunction = () => ({
  body: <Wrapper />,
  head: <div />,
  title: ''
})

export default A
