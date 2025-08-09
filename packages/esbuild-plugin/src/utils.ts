import { type BuiltFile } from '@hd-web/build'
import * as esbuild from 'esbuild'
import path from 'path'

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
