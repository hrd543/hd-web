#!/usr/bin/env node

import { buildPackage } from '../build-package/index.js'
import { buildScript } from '../build/index.js'
import { devScript } from '../dev/index.js'

const allArgs = process.argv.slice(2)
const [scriptType, ...args] = allArgs

if (scriptType === 'build') {
  buildScript()
} else if (scriptType === 'dev') {
  devScript()
} else if (scriptType === 'package') {
  buildPackage(args)
} else {
  throw new Error(`Script ${scriptType} doesn't exist`)
}
