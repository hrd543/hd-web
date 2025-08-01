import { Template, Component } from '@hd-web/jsx'
import { Header } from './Header.js'

const Logo = () => <div>henry</div>

@Template({
  render: () => (
    <div>
      <Header logo={<Logo />} items={[]} bgColour="" fontColour="" />
      <span>yoyo</span>
    </div>
  )
})
export class Wrapper extends Component {
  init() {}
}
