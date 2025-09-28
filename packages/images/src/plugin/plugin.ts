import type { HdPlugin } from 'hd-web'
import fs from 'fs/promises'

import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'
import {
  getImages,
  resetImages,
  getCopiedImgSrc,
  registerImage
} from '../shared/index.js'
import path from 'path'
import { processImage } from '../processing/processImage.js'

export const plugin = (fileTypes = imageFileTypes): HdPlugin => {
  const filterRegex = buildFileTypeRegex(fileTypes)

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

    onResolve: {
      filter: filterRegex,
      resolve: async ({ path, type }) => {
        // If this
        if (type === 'css') {
          const image = { src: path }
          registerImage(image)

          return {
            path: getCopiedImgSrc(image),
            // TODO add this as an actual option
            external: true
          }
        }
      }
    },

    onLoad: {
      filter: filterRegex,
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
