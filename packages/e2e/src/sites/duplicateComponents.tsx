import { Site } from 'hd-web'

import { Component } from './components/Component.js'
import { Duplicate } from './components/Duplicate.js'

const duplicateComponents: Site = {
  root: {
    title: 'Duplicate components site',
    content: () => (
      <div>
        <Component id={1} _client="" />
        <Duplicate />
      </div>
    )
  },
  head: () => ''
}

export default duplicateComponents
