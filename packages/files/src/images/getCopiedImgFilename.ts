import { ImageModifications } from '../shared/modifications.js'
import { FileNameFunction } from '../shared/types.js'

// TODO work out how I could actually hash the image contents
// This might require async views
export const getCopiedImgFilename: FileNameFunction<ImageModifications> = (
  { name, ext },
  modifications
) => {
  if (!modifications) {
    return { name, ext }
  }

  // TODO hash the quality and size properly

  return { name: `${name}-${modifications.quality}`, ext: 'webp' }
}
