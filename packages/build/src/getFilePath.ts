import * as url from 'url'
import * as path from 'path'

export const getFilePath = (filepath: string, isImport: boolean) => {
  const pathToFile = path.resolve(process.cwd(), filepath)

  if (isImport) {
    return url.pathToFileURL(pathToFile).href
  }

  return pathToFile
}
