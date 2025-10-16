import { AsyncView } from 'hd-web'
import { ImageProps } from './types.js'
import { getImageStyle } from './getImageStyle.js'
import { ImageModifications } from '../shared/modifications.js'
import { registerFile } from '../register/registerFile.js'

export const Image: AsyncView<ImageProps> = async ({
  alt,
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

  const newSrc = await registerFile(src.comesFrom, modifications)

  return (
    <img
      class={`hd-image ${className ?? ''}`}
      loading={lazy ? 'lazy' : undefined}
      style={getImageStyle(dim)}
      width={width}
      height={height}
      alt={alt}
      src={newSrc}
    />
  )
}
