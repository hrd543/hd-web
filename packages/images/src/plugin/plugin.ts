import type { HdPlugin } from 'hd-web'
import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'
import { getImages, registerImage, resetImages } from '../shared/index.js'

export const plugin = (fileTypes = imageFileTypes): HdPlugin => {
  return {
    name: 'hd-plugin-images',

    async onBuildStart() {
      resetImages()
    },

    async onBuildEnd() {
      console.log('images', getImages())
      resetImages()
    },

    // Don't let esbuild handle these images
    modifyConfig(config) {
      return {
        ...config,
        fileTypes: config.fileTypes.filter((f) => !fileTypes.includes(f))
      }
    },

    onLoad: {
      filter: buildFileTypeRegex(fileTypes),
      load: async ({ path }) => {
        registerImage({ src: path })

        return {
          contents: `const path = "${path}"; export default path`
        }
      }
    }
  }
}
