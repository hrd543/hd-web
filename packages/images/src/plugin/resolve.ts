import { HdConfig, OnResolveArgs, OnResolveResult } from 'hd-web'
import { getCopiedImgSrc, registerImage } from '../shared/index.js'

/**
 * We need to resolve css imports as unoptimised images,
 * and register the image to be copied over.
 */
export const resolveCallback = async ({
  path,
  type
}: OnResolveArgs<HdConfig>): Promise<OnResolveResult | void> => {
  if (type === 'css') {
    const image = { src: path }
    registerImage(image)

    return {
      path: getCopiedImgSrc(image),
      external: true
    }
  }
}
