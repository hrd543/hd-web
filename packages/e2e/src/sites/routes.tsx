import { SiteFunction } from 'hd-web'

import { Component } from './components/Component.js'

const routes: SiteFunction = () => ({
  title: 'Root',
  body: () => (
    <div id="root">
      {/* Adding this to trigger the js file */}
      <Component id={1} />
    </div>
  ),
  head: () => <meta id="head-root" name="test" />,
  routes: {
    leaf: () => ({
      title: 'leaf',
      body: () => <div id="leaf">Leaf</div>
    }),
    child: () => ({
      title: 'child',
      body: () => <div id="child">Child</div>,
      head: () => <meta id="head-child" name="test" />,
      routes: {
        leaf: () => ({
          title: 'leaf',
          body: () => <div id="leaf2">Leaf 2</div>
        }),
        grandchild: () => ({
          title: 'grandchild',
          body: () => <div id="grandchild">Grandchild</div>,
          head: () => <meta id="head-grandchild" name="test" />
        })
      }
    })
  }
})

export default routes
