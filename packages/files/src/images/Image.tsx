import { View } from 'hd-web'
import { ImageProps } from './types.js'
import { getImageStyle } from './getImageStyle.js'
import { registerFile } from '../register/fileRegistration.js'
import { getCopiedSrc } from '../register/getCopiedSrc.js'
import { getCopiedImgFilename } from './getCopiedImgFilename.js'
import { ImageModifications } from '../shared/modifications.js'

export const Image: View<ImageProps> = ({
  alt,
  // TODO change this type to just be comesFrom
  src,
  width,
  height,
  resize,
  quality,
  dim = 'w',
  lazy = true,
  className
}) => {
  const modifications: ImageModifications = { quality }

  if (resize) {
    modifications.size = [width, height]
  }

  const image = { src: src.comesFrom, modifications }
  registerFile(image)

  return (
    <img
      class={`hd-image ${className ?? ''}`}
      loading={lazy ? 'lazy' : undefined}
      style={getImageStyle(dim)}
      width={width}
      height={height}
      alt={alt}
      src={getCopiedSrc(image, getCopiedImgFilename)}
    />
  )
}
