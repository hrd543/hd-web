import path from 'path'
import * as esbuild from 'esbuild'
import { BuiltFile } from './types.js'

const getFileType = (end: string): BuiltFile['type'] => {
  if (end.endsWith('.js') || end.endsWith('.ts')) {
    return 'js'
  }

  if (end.endsWith('.css')) {
    return 'css'
  }

  return 'file'
}

export const readMetafile = (
  metafile: esbuild.Metafile,
  out: string
): BuiltFile[] => {
  return Object.keys(metafile.outputs).reduce((all, file) => {
    all.push({
      path: file,
      relativePath: path.relative(out, file),
      type: getFileType(path.extname(file))
    })

    return all
  }, [] as BuiltFile[])
}

const supportedFileTypes = ['.png', '.webp', '.woff2', '.jpg', '.jpeg']

export const getFileLoaders = (extraFileTypes: string[]) =>
  [...supportedFileTypes, ...extraFileTypes].reduce(
    (all, type) => {
      all[type] = 'file'

      return all
    },
    {} as Record<string, 'file'>
  )
