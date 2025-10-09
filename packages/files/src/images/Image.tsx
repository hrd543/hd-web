import { View } from 'hd-web'
import { ImageProps } from './types.js'
import { getImageStyle } from './getImageStyle.js'
import { registerFile } from '../register/fileRegistration.js'
import { getCopiedSrc } from '../register/getCopiedSrc.js'
import { getCopiedImgFilename } from './getCopiedImgFilename.js'

export const Image: View<ImageProps> = ({
  alt,
  src,
  ratio = 1,
  quality = 100,
  dim = 'w',
  lazy = true,
  className
}) => {
  // Use height 100 just to give it an actual ratio
  const height = 100
  const width = height * ratio

  const image = { src: src.comesFrom, modifications: { quality } }
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
