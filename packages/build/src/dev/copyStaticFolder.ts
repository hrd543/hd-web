import path from 'path'
import FileSystem from './filesystem.js'
import fs from 'fs/promises'

/**
 * Copy each file in the static folder into the filesystem
 */
export const copyStaticFolder = async (
  folder: string,
  filesystem: FileSystem
) => {
  const files = (
    await fs.readdir(folder, {
      withFileTypes: true,
      recursive: true
    })
  ).filter((f) => f.isFile())

  await Promise.all(
    files.map((file) => {
      const filepath = path.join(file.parentPath, file.name)

      return fs
        .readFile(filepath)
        .then((content) => filesystem.write(filepath, content))
    })
  )
}
