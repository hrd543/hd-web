import { View } from 'hd-web'
import { ImageProps } from './types.js'
import { getImageStyle } from './getImageStyle.js'
import { registerImage, getCopiedImgSrc } from '../shared/index.js'

export const Image: View<ImageProps> = ({
  alt,
  src,
  ratio = 1,
  quality,
  dim = 'w',
  lazy = true,
  className
}) => {
  // Use height 100 just to give it an actual ratio
  const height = 100
  const width = height * ratio

  const image = { src: src.comesFrom, modifications: { quality } }
  registerImage(image)

  return (
    <img
      class={`hd-image ${className ?? ''}`}
      loading={lazy ? 'lazy' : undefined}
      style={getImageStyle(dim)}
      width={width}
      height={height}
      alt={alt}
      src={getCopiedImgSrc(image)}
    />
  )
}
