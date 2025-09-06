import { SiteFunction } from 'hd-web'

import { Component } from './components/Component.js'
import { Unused } from './components/Unused.js'

const components: SiteFunction = () => ({
  title: 'Components',
  body: () => (
    <div>
      <Component id={1} />
      <Component id={2} />
      {/* The component is being imported but not actually rendered. */}
      {Unused.name}
    </div>
  ),
  head: () => <meta id="head" name="test" />
})

export default components
