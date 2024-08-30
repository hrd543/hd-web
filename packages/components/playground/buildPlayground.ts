import { buildSite } from '@hd-web/build'

buildSite(
  {
    entry: 'playground.tsx',
    output: 'playgroundBuilt.js'
  },
  {
    entry: 'playground.html',
    output: 'playgroundBuilt.html'
  }
)
