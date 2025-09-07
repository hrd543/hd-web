import { SiteFunction } from 'hd-web'

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
        ),
        routes: {
          one: () => ({
            title: 'one',
            body: () => null,
            head: () => (
              <meta>
                <meta name="hh" />
              </meta>
            ),
            routes: {
              two: () => ({
                title: 'two',
                body: () => null
              }),
              three: () => ({
                title: 'two',
                body: () => null,
                head: () => <meta name="three" />
              })
            }
          })
        }
      })
    }
  }
}

export default App
