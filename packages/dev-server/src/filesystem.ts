import path from 'path'
import fs from 'fs/promises'

export type FileSystem = {
  exists: (file: string) => boolean | Promise<boolean>
  read: (file: string) => any | Promise<any>
}

export const getDiskFileSystem = (folder: string): FileSystem => ({
  exists: async (file) => {
    const filename = path.join(folder, file)

    try {
      const stats = await fs.stat(filename)

      if (stats.isDirectory()) {
        return false
      }

      return true
    } catch {
      return false
    }
  },
  read: async (file) => {
    const filename = path.join(folder, file)

    try {
      return await fs.readFile(filename)
    } catch {
      return
    }
  }
})
