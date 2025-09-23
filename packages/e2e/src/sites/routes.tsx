import { Site } from 'hd-web'

import { Component } from './components/Component.js'

const routes: Site = {
  root: {
    title: 'Root',
    content: () => (
      <div id="root">
        {/* Adding this to trigger the js file */}
        <Component client="" id={1} />
      </div>
    ),
    routes: {
      leaf: {
        title: 'leaf',
        content: () => <div id="leaf">Leaf</div>
      },
      child: {
        title: 'child',
        content: () => <div id="child">Child</div>,
        head: () => <meta id="head-child" name="test" />,
        routes: {
          leaf: {
            title: 'leaf',
            content: () => <div id="leaf2">Leaf 2</div>
          },
          grandchild: {
            title: 'grandchild',
            content: () => <div id="grandchild">Grandchild</div>,
            head: () => <meta id="head-grandchild" name="test" />
          }
        }
      }
    }
  },
  head: () => <meta id="head-root" name="test" />
}

export default routes
