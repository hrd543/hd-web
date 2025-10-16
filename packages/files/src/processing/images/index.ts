import { getImageFiletype } from './getImageFiletype.js'
import {
  ImageModifications,
  stringifyImageModifications
} from './imageModifications.js'
import { processImage } from './processImage.js'
import { FileProcessor } from '../fileProcessor.js'
import { sanitiseImageModifications } from './sanitiseImageModifications.js'

export const imageProcessor: FileProcessor<ImageModifications> = {
  stringifyModifications: stringifyImageModifications,
  process: processImage,
  getFileType: getImageFiletype,
  sanitise: sanitiseImageModifications
}
