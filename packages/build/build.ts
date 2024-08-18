import { buildPackage } from './src/index.js'

buildPackage(import.meta.resolve, ['./package.json', '../../package.json'], {
  platform: 'node'
})
