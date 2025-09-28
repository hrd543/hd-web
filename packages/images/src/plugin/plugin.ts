import type { HdPlugin } from 'hd-web'
import fs from 'fs/promises'

import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'
import { getImages, resetImages, getCopiedImgSrc } from '../shared/index.js'
import path from 'path'
import { processImage } from '../processing/processImage.js'

export const plugin = (fileTypes = imageFileTypes): HdPlugin => {
  return {
    name: 'hd-plugin-images',

    async onBuildStart() {
      resetImages()
    },

    async onBuildEnd({ out, write }) {
      const images = getImages()
      const copied: string[] = []

      if (write) {
        await fs.mkdir(path.join(out, 'images'))
      }

      for (const image of images) {
        const newSrc = getCopiedImgSrc(image)

        copied.push(newSrc)

        if (write) {
          await processImage(image, path.posix.join(out, newSrc))
        }
      }

      resetImages()

      return {
        files: copied.map((f) => ({ relativePath: f }))
      }
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
        const newSrc = getCopiedImgSrc({ src: path })
        const stringifiedPath = JSON.stringify(path)

        const contents = `
          export default {
            get src() {
              globalThis._hdImages.set(${stringifiedPath}, [{ src: ${stringifiedPath} }])

              return "${newSrc}"
            },
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
