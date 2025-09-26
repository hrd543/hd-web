import type { HdPlugin } from 'hd-web'
import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'

export const plugin = (fileTypes = imageFileTypes): HdPlugin => {
  let images: string[] = []

  return {
    name: 'hd-plugin-images',
    async onBuildEnd() {
      console.log('images', [...images])
      images = []
    },

    // Don't let esbuild handle images
    modifyConfig(config) {
      return {
        ...config,
        fileTypes: []
      }
    },

    onLoad: {
      filter: buildFileTypeRegex(fileTypes),
      load: async ({ path }) => {
        images.push(path)

        return {
          contents: `const path = "${path}"; export default path`
        }
      }
    }
  }
}
