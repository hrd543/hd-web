import { exec } from 'child_process'

import { copyStaticFiles } from './copyStaticFiles.js'
import { deleteBuildFolder } from './deleteBuildFolder.js'
import { transformClientFiles } from './transformClientFiles.js'

export const buildPackage = async (
  src: string,
  dist: string,
  regex: string
) => {
  await deleteBuildFolder(dist)

  if (regex) {
    copyStaticFiles(src, dist, new RegExp(regex))
  }

  exec('tsc', () => {
    transformClientFiles(dist)
  })
}
