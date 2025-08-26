import { SiteFunction } from '../shared/index.js'
import { Henry } from './Henry.js'

const App: SiteFunction = async () => {
  return {
    head: () => <meta />,
    body: () => <div>hiya</div>,
    title: 'app10',
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
  }
}

export default App
