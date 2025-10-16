import fs from 'fs/promises'
import path from 'path'
import { initialiseFiles, resetFiles } from '../register/registerFile.js'

// We want to copy files over only when writing for now.
export const onBuildStart = async (write: boolean | undefined, out: string) => {
  if (write) {
    initialiseFiles(out)
    await fs.mkdir(path.join(out, 'files'))
  }
}

/**
 * On build end, process and copy over the files, then reset
 */
export const onBuildEnd = () => {
  resetFiles()
}
