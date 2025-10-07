import { ImageModifications } from '../shared/modifications.js'

export const getCopiedImgFilename = (
  name: string,
  ext: string,
  modifications?: ImageModifications
) => {
  if (!modifications) {
    return `${name}${ext}`
  }
  // TODO add some hashing here

  return `${name}-${modifications.quality}.webp`
}
