import { View } from 'hd-web'
import { MarkdownOptions } from '../types.js'
import { Image } from '@hd-web/files'

const getImageSize = (
  imgSrc: string,
  size: MarkdownOptions['images']['size']
): { width?: number; height?: number; resize: boolean } => {
  if (!size) {
    return { resize: false }
  }

  if (Array.isArray(size)) {
    return {
      width: size[0],
      height: size[1],
      resize: true
    }
  }

  return getImageSize(imgSrc, size(imgSrc))
}

export const mdImage =
  (options: MarkdownOptions): View<{ alt: string; src: string }> =>
  ({ alt, src }) => {
    const { width, height, resize } = getImageSize(src, options.images.size)

    return (
      <Image
        alt={alt}
        width={width}
        height={height}
        resize={resize}
        src={{ comesFrom: src }}
        quality={options.images.quality}
      />
    )
  }
