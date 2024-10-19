#!/usr/bin/env node

import { copyStaticFiles } from './copyStaticFiles.js'
import { deleteBuildFolder } from './deleteBuildFolder.js'

const args = process.argv.slice(2)
const [src = 'src', dist = 'dist', regex] = args

deleteBuildFolder(dist).then(() => {
  if (regex) {
    copyStaticFiles(src, dist, new RegExp(regex))
  }
})
