import * as url from 'url'
import * as path from 'path'

/** Replace all \ with / if importing on Windows */
export const formatPathForImport = (p: string) =>
  p.replaceAll(path.sep, path.posix.sep)

/** Get the file url for the filepath so that it may be import()ed */
export const getImportPath = (filepath: string) =>
  url.pathToFileURL(filepath).href
