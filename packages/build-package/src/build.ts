#!/usr/bin/env node

import { exec } from 'child_process'
import { copyStaticFiles } from './copyStaticFiles.js'
import { deleteBuildFolder } from './deleteBuildFolder.js'
import { transformClientFiles } from './addFileToClass.js'

const args = process.argv.slice(2)
const [src = 'src', dist = 'dist', regex] = args

console.log('here')

deleteBuildFolder(dist).then(() => {
  if (regex) {
    copyStaticFiles(src, dist, new RegExp(regex))
  }

  exec('tsc', () => {
    transformClientFiles(dist)
  })
})
