import { SiteFunction } from 'hd-web'

import { Component } from './components/Component.js'
import { Duplicate } from './components/Duplicate.js'

const duplicateComponents: SiteFunction = () => ({
  title: 'Duplicate components site',
  body: () => (
    <div>
      <Component id={1} _client="" />
      <Duplicate />
    </div>
  ),
  head: () => ''
})

export default duplicateComponents
