import type { HdPlugin } from 'hd-web'
import fs from 'fs/promises'

import { buildFileTypeRegex, imageFileTypes } from './imageFileTypes.js'
import { getImages, resetImages } from '../shared/index.js'
import { getBuildSrc } from './getBuildSrc.js'
import path from 'path'

export const plugin = (fileTypes = imageFileTypes): HdPlugin => {
  return {
    name: 'hd-plugin-images',

    async onBuildStart() {
      resetImages()
    },

    async onBuildEnd({ out, write }) {
      const { original, compressed } = getImages()
      const copied: string[] = []

      if (write) {
        await fs.mkdir(path.join(out, 'images'))
      }

      for (const image of original) {
        const { src, relativeSrc } = getBuildSrc(out, image)
        copied.push(relativeSrc)

        if (write) {
          await fs.copyFile(image, src)
        }
      }

      // For now, just copying without compression
      for (const { src: image } of compressed) {
        const { src, relativeSrc } = getBuildSrc(out, image)
        copied.push(relativeSrc)

        if (write) {
          await fs.copyFile(image, src)
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
