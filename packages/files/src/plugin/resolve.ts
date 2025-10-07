import type { OnResolveArgs, OnResolveResult } from 'esbuild'
import { registerFile } from '../register/fileRegistration.js'
import { getCopiedSrc } from '../register/getCopiedSrc.js'

const cssKinds = new Set(['import-rule', 'composes-from', 'url-token'])

/**
 * We need to resolve css imports as unoptimised files,
 * and register the file to be copied over.
 */
export const resolveCallback = async ({
  path,
  kind
}: OnResolveArgs): Promise<OnResolveResult | undefined> => {
  if (cssKinds.has(kind)) {
    const file = { src: path }
    registerFile(file)

    return {
      path: getCopiedSrc(file),
      external: true
    }
  }
}
