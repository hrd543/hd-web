import * as esbuild from 'esbuild'
import path from 'path'

import { BuiltFile } from './types.js'

export const getFileType = (file: string): BuiltFile['type'] => {
  if (file.endsWith('.js') || file.endsWith('.ts')) {
    return 'js'
  }

  if (file.endsWith('.css')) {
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

export const readBuildResultFile = (
  file: esbuild.OutputFile,
  out: string
): BuiltFile => {
  const type = getFileType(file.path)
  const contents = type === 'file' ? undefined : file.text

  return {
    type,
    path: file.path,
    relativePath: path.relative(path.join(process.cwd(), out), file.path),
    contents
  }
}
