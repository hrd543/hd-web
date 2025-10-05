#!/usr/bin/env node
import minimist from 'minimist'

import { buildScript } from '../build/index.js'
import { buildPackage } from '../build-package/index.js'
import { devScript } from '../dev/script.js'
import { HdError } from '../errors/HdError.js'

const allArgs = process.argv.slice(2)
const [scriptType, ...args] = allArgs

const run = async () => {
  // Wrap in try-catch to format hd errors nicely when using the
  // cli script
  try {
    if (scriptType === 'build') {
      await buildScript()
    } else if (scriptType === 'dev') {
      await devScript()
    } else if (scriptType === 'package') {
      const { src = 'src', dist = 'dist', files } = minimist(args)

      await buildPackage(src, dist, files)
    } else {
      console.error(`Script ${scriptType} doesn't exist for command hd`)
    }
  } catch (e: unknown) {
    if (e instanceof HdError) {
      console.error(e.toString())
    } else {
      // This means something went wrong which we didn't expect.
      // In this case, throw to help with debugging
      throw e
    }
  }
}

run()
