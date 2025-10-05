import type { OnResolveArgs, OnResolveResult } from 'esbuild'
import { registerImage } from '../shared/index.js'

const cssKinds = new Set(['import-rule', 'composes-from', 'url-token'])

/**
 * We need to resolve css imports as unoptimised images,
 * and register the image to be copied over.
 */
export const resolveCallback = async ({
  path,
  kind
}: OnResolveArgs): Promise<OnResolveResult | undefined> => {
  if (cssKinds.has(kind)) {
    const image = { src: path }
    const registered = registerImage(image)

    return {
      path: registered,
      external: true
    }
  }
}
