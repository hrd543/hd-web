import { SiteFunction } from '../shared/index.js'
import { Henry } from './Henry.js'

const wait = (timeout = 10_000) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(true)
    }, timeout)
  })
}

const App: SiteFunction = async () => {
  await wait()

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
