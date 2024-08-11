import { JSX } from '@hd-web/jsx'
import { Header } from '@hd-web/components'

const App: JSX.Component = () => (
  <Header items={[{ link: '#about', title: 'About' }]} logo="HD Logs" />
)

export default App
