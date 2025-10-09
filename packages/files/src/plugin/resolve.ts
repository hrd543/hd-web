import nodePath from 'path'
import type { OnResolveArgs, OnResolveResult } from 'esbuild'

import { registerFile } from '../register/fileRegistration.js'
import { getCopiedSrc } from '../register/getCopiedSrc.js'

const cssKinds = new Set(['import-rule', 'composes-from', 'url-token'])

// TODO consolidate all instances of functions like this

const getFullSrc = (path: string, importer: string) => {
  if (path.startsWith('.')) {
    return nodePath.join(nodePath.dirname(importer), path)
  }

  if (path.startsWith('/')) {
    return nodePath.join(process.cwd(), path)
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
    const file = { src: getFullSrc(path, importer) }
    registerFile(file)

    return {
      path: getCopiedSrc(file),
      external: true
    }
  }
}

// TODO Fix the preview images on the blogs - their src is wrong.
