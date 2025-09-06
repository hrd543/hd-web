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

export const copyStaticFolder = async ({
  staticFolder,
  out,
  write
}: BuildConfig): Promise<BuiltFile[] | undefined> => {
  if (!staticFolder) {
    return
  }

  if (write) {
    await fs.cp(staticFolder, out, { recursive: true })
  }

  const contents = await fs.readdir(staticFolder, {
    recursive: true,
    withFileTypes: true
  })

  return contents
    .filter((dirent) => dirent.isFile())
    .map((dirent) => {
      const filepath = path.relative(
        staticFolder,
        path.join(dirent.parentPath, dirent.name)
      )

      return {
        path: path.join(out, filepath),
        relativePath: filepath,
        type: getFileType(filepath)
      }
    })
}
