import fs from 'fs/promises'
import path from 'path'
import {
  getFiles,
  initialiseFiles,
  resetFiles
} from '../register/fileRegistration.js'
import { processImage } from '../images/processImage.js'

// We want to copy files over only when writing for now.
export const onBuildStart = (write: boolean | undefined) => {
  if (write) {
    console.log('init')
    initialiseFiles()
  }
}

/**
 * On build end, process and copy over the files, then reset
 */
export const onBuildEnd = async (
  out: string,
  write: boolean | undefined
): Promise<void> => {
  if (!write) {
    return
  }

  const files = getFiles()

  if (files.length > 0) {
    await fs.mkdir(path.join(out, 'files'))

    for (const file of files) {
      if (file.type === 'image') {
        await processImage(file, out)
      }
    }
  }

  resetFiles()
}
