import * as url from 'url'
import * as path from 'path'

export const getFilePath = (
  file: string,
  isImport: boolean,
  baseDir = process.cwd()
) => {
  const pathToFile = path.resolve(baseDir, file)

  if (isImport) {
    return url.pathToFileURL(pathToFile).href
  }

  return pathToFile
}
