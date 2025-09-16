import { exec } from 'child_process'
import minimist from 'minimist'

import { copyStaticFiles } from './copyStaticFiles.js'
import { deleteBuildFolder } from './deleteBuildFolder.js'
import { transformClientFiles } from './transformClientFiles.js'

export const buildPackage = async (cliArgs: string[]) => {
  const { src = 'src', dist = 'dist', files } = minimist(cliArgs)

  await deleteBuildFolder(dist)

  if (files) {
    copyStaticFiles(src, dist, new RegExp(files))
  }

  exec('tsc', () => {
    transformClientFiles(dist)
  })
}
