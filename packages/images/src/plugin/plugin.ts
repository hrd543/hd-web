import type { HdPlugin } from 'hd-web'
import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'
import { getImages, resetImages } from '../shared/index.js'
import { getBuildSrc } from './getBuildSrc.js'

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
      load: async ({ path, config }) => {
        const { relativeSrc } = getBuildSrc(config.out, path)
        const stringifiedPath = JSON.stringify(path)

        const contents = `
          export default {
            get src() {
              globalThis._hdImages.original.add(${stringifiedPath})

              return "${relativeSrc}"
            },
            srcRaw: "${relativeSrc}",
            comesFrom: ${stringifiedPath}
          }
          `

        return {
          contents
        }
      }
    }
  }
}
