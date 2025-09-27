import type { HdPlugin } from 'hd-web'
import fs from 'fs/promises'

import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'
import { getImages, resetImages } from '../shared/index.js'
import { getBuildSrc } from './getBuildSrc.js'

export const plugin = (fileTypes = imageFileTypes): HdPlugin => {
  return {
    name: 'hd-plugin-images',

    async onBuildStart() {
      resetImages()
    },

    async onBuildEnd({ out }) {
      const { original, compressed } = getImages()

      for (const image of original) {
        const { src } = getBuildSrc(out, image)

        // Need to respect the "write" option here.
        await fs.copyFile(image, src)
      }

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
