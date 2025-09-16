import { exec } from 'child_process'

import { copyStaticFiles } from './copyStaticFiles.js'
import { deleteBuildFolder } from './deleteBuildFolder.js'
import { transformClientFiles } from './transformClientFiles.js'

export const buildPackage = async ([
  src = 'src',
  dist = 'dist',
  regex
]: string[]) => {
  console.log(src, dist, regex)
  await deleteBuildFolder(dist)

  if (regex) {
    copyStaticFiles(src, dist, new RegExp(regex))
  }

  exec('tsc', () => {
    transformClientFiles(dist)
  })
}
