import { SiteFunction } from '../types/index.js'
import { Henry } from './Henry.js'

const App: SiteFunction = () => ({
  head: () => <meta />,
  body: () => <div>hiya</div>,
  title: 'app',
  routes: {
    contact: () => ({
      title: 'contact',
      body: () => (
        <div>
          <Henry />
        </div>
      )
    })
  }
})

export default App
