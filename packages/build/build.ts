import { buildPackage } from './src/index.js'

buildPackage(['./package.json', '../../package.json'], {
  platform: 'node'
})
