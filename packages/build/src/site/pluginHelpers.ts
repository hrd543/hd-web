import * as esbuild from 'esbuild'
import path from 'path'
import { BuiltFile } from './writeToHtml.js'

export const reduceMap = <K, V>(maps: Array<Map<K, V>>): Map<K, V> => {
  return maps.reduce((full, map) => {
    map.entries().forEach(([k, v]) => full.set(k, v))

    return full
  }, new Map<K, V>())
}

export const loopComponents = (components: Map<string, string>) => {
  const imports: string[] = []
  const entries: string[] = []

  components.entries().forEach(([name, file]) => {
    // Get rid of the leading file:///
    imports.push(`import ${name} from "${file.slice(8)}";`)
    entries.push(`["${name}", ${name}]`)
  })

  return {
    imports: imports.join(''),
    entries: '[' + entries.join(',') + ']'
  }
}

export const getEntryPoint = ({
  entryPoints
}: esbuild.BuildOptions): string => {
  if (!Array.isArray(entryPoints) || entryPoints.length !== 1) {
    throw new Error('Expected entry points to be a single element array')
  }

  const entry = entryPoints[0]!

  if (typeof entry !== 'string') {
    throw new Error('Expected entry point to be a string')
  }

  return entry
}

export const getOutFolder = ({ outdir }: esbuild.BuildOptions): string => {
  if (!outdir) {
    throw new Error('Expected outdir to be present')
  }

  return outdir
}

export const readMetafile = (
  metafile: esbuild.Metafile,
  entry: string,
  out: string
): BuiltFile[] => {
  return Object.entries(metafile.outputs).reduce((all, [file, output]) => {
    const builtFile: BuiltFile = {
      path: file,
      relativePath: path.relative(out, file),
      type: path.extname(file)
    }

    // This means the file is the main entry point
    if (output.entryPoint === entry) {
      builtFile.isEntry = true
    }

    all.push(builtFile)

    return all
  }, [] as BuiltFile[])
}
