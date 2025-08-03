import { type BuiltFile } from '@hd-web/build'
import * as esbuild from 'esbuild'
import path from 'path'

export const readMetafile = (
  metafile: esbuild.Metafile,
  out: string
): BuiltFile[] => {
  return Object.keys(metafile.outputs).reduce((all, file) => {
    all.push({
      path: file,
      relativePath: path.relative(out, file),
      type: path.extname(file)
    })

    return all
  }, [] as BuiltFile[])
}
