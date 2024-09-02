import { buildPackage } from './src/index.js'

buildPackage(['./package.json', '../../package.json'], {
  platform: 'node'
})

export { writeToHtml } from '.\\src\\site\\writeToHtml.js'
