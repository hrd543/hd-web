import { HdConfig, OnLoadArgs, OnLoadResult } from 'hd-web'
import { getCopiedImgSrc } from '../shared/index.js'

/**
 * We want loading an image to return an object which can access both the
 * new src attribute, as well as the original location.
 *
 * If accessing `src`, we want to register the image to be copied.
 */
export const loadCallback = async ({
  path
}: OnLoadArgs<HdConfig>): Promise<OnLoadResult> => {
  const newSrc = getCopiedImgSrc({ src: path })
  const stringifiedPath = JSON.stringify(path)

  const contents = `
    export default {
      get src() {
        globalThis._hdImages?.set(${stringifiedPath}, [{ src: ${stringifiedPath} }])

        return "${newSrc}"
      },
      comesFrom: ${stringifiedPath}
    }
  `

  return {
    contents
  }
}
