import { Page } from '@hd-web/build'
import './defaults.css'
import './variables.css'

// This is your page's html
const App: Page = () => ({
  body: <div>Hello world!</div>
})

// It needs to be the default export in order to build
export default App
