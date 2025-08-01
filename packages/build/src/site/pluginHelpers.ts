import * as esbuild from 'esbuild'
import path from 'path'
import { BuiltFile } from './writeToHtml.js'

export const reduceMap = <K, V>(maps: Array<Map<K, V>>): Map<K, V> => {
  return maps.reduce((full, map) => {
    map.entries().forEach(([k, v]) => full.set(k, v))

    return full
  }, new Map<K, V>())
}

export const getOutFolder = ({ outdir }: esbuild.BuildOptions): string => {
  if (!outdir) {
    throw new Error('Expected outdir to be present')
  }

  return outdir
}

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
