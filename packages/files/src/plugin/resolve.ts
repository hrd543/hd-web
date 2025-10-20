import nodePath from 'path'
import type { OnResolveArgs, OnResolveResult } from 'esbuild'
import { registerFile } from '../register/registerFile.js'

const cssKinds = new Set(['import-rule', 'composes-from', 'url-token'])

// TODO consolidate all instances of functions like this

// Gets the abs path relative to cwd
const getPath = (src: string) => {
  const absPath = nodePath.relative(process.cwd(), src).replaceAll('\\', '/')

  if (absPath.startsWith('.')) {
    throw new Error(`Path ${src} must be within cwd`)
  }

  if (absPath.startsWith('/')) {
    return absPath
  }

  return '/' + absPath
}

// fixes relative imports
const getFullSrc = (path: string, importer: string) => {
  if (path.startsWith('.')) {
    return nodePath.join(nodePath.dirname(importer), path)
  }

  return path
}

/**
 * We need to resolve css imports as unoptimised files,
 * and register the file to be copied over.
 */
export const resolveCallback = async ({
  path,
  kind,
  importer
}: OnResolveArgs): Promise<OnResolveResult | undefined> => {
  if (cssKinds.has(kind)) {
    return {
      path: await registerFile(getPath(getFullSrc(path, importer)), undefined),
      external: true
    }
  }
}
