#!/usr/bin/env node

import { exec } from 'child_process'
import { copyStaticFiles } from './copyStaticFiles.js'
import { deleteBuildFolder } from './deleteBuildFolder.js'
import { transformClientFiles } from './transformClientFiles.js'

const args = process.argv.slice(2)
const [src = 'src', dist = 'dist', regex] = args

deleteBuildFolder(dist).then(() => {
  if (regex) {
    copyStaticFiles(src, dist, new RegExp(regex))
  }

  exec('tsc', () => {
    transformClientFiles(dist)
  })
})
