import { Site } from 'hd-web'

import { Component } from './components/Component.js'
import { Unused } from './components/Unused.js'

const components: Site = {
  root: {
    title: 'Components',
    content: () => (
      <div>
        <Component client="client1" id={1} />
        <Component client="client2" id={2} />
        {/* The component is being imported but not actually rendered. */}
        {Unused.name}
      </div>
    )
  },
  head: () => <meta id="head" name="test" />
}

export default components
