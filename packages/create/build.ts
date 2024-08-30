import { buildPackage } from '@hd-web/build'

buildPackage(['./package.json', '../../package.json'], { platform: 'node' })
