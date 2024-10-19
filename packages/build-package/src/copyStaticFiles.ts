import fs from 'fs/promises'
import path from 'path'

/**
 * Copy all files which match the regex from the from directory into
 * the to directory.
 *
 * Will maintain the folder structure when copying.
 */
export const copyStaticFiles = async (
  from: string,
  to: string,
  regex: RegExp
) => {
  for (const item of await fs.readdir(from, {
    recursive: true,
    withFileTypes: true
  })) {
    // Ignore folders and files which don't match
    if (!item.isFile() || !regex.test(item.name)) {
      continue
    }

    const { parentPath, name } = item
    const folderInToDir = path.join(to, path.relative(from, parentPath))

    // Make the directory
    await fs.mkdir(folderInToDir, { recursive: true })
    // And copy the file over
    await fs.copyFile(
      path.join(parentPath, name),
      path.join(folderInToDir, name)
    )
  }
}
