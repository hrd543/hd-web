import { View } from 'hd-web'
import { ImageProps } from './types.js'
import { getImageStyle } from './getImageStyle.js'
import { registerCompressedImage } from '../shared/index.js'

export const Image: View<ImageProps> = ({
  alt,
  src,
  ratio = 1,
  compression,
  dim = 'w',
  lazy = true,
  className
}) => {
  // Use height 100 just to give it an actual ratio
  const height = 100
  const width = height * ratio

  registerCompressedImage({ src: src.comesFrom, compression })

  return (
    <img
      class={`hd-image ${className ?? ''}`}
      loading={lazy ? 'lazy' : undefined}
      style={getImageStyle(dim)}
      width={width}
      height={height}
      alt={alt}
      src={src.srcRaw}
    />
  )
}
