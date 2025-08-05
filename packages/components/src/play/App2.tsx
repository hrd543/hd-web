import { SiteFunction } from '@hd-web/build'
import { Wrapper } from './Wrapper.js'

// For some reason, it thinks this is the component attached with the above template
const A: SiteFunction = () => ({
  body: <Wrapper />,
  head: <div />,
  title: 'new title 24'
})

export default A
