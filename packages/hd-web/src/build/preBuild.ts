import fs from 'fs/promises'
import path from 'path'

import { BuildConfig } from './config.js'
import { BuiltFile } from './types.js'
import { getFileType } from './utils.js'

export const deleteBuildFolder = async (config: BuildConfig) => {
  if (config.write) {
    await fs.rm(config.out, { recursive: true, force: true })
  }
}

export const copyStaticFolder = async (
  config: BuildConfig
): Promise<BuiltFile[] | undefined> => {
  if (!config.staticFolder) {
    return
  }

  if (config.write) {
    await fs.cp(config.staticFolder, config.out, { recursive: true })
  }

  const contents = await fs.readdir(config.staticFolder, {
    recursive: true,
    withFileTypes: true
  })

  return contents
    .filter((dirent) => dirent.isFile())
    .map((dirent) => ({
      path: path.join(config.out, dirent.parentPath),
      relativePath: dirent.parentPath,
      type: getFileType(dirent.parentPath)
    }))
}
