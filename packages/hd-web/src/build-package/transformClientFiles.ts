import fs from 'fs/promises'
import path from 'path'

import { addFileToClass } from '../utils/index.js'

export const transformClientFiles = async (folder: string) => {
  const entries = await fs.readdir(folder, {
    withFileTypes: true,
    recursive: true
  })

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.client.js')) {
      const p = path.posix.join(entry.parentPath, entry.name)
      const code = await fs.readFile(p, { encoding: 'utf-8' })

      await fs.writeFile(p, addFileToClass(code))
    }
  }
}
