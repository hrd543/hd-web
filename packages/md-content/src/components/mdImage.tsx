import { View } from 'hd-web'
import { MarkdownOptions } from '../types.js'
import { Image } from '@hd-web/files'

export const mdImage =
  (options: MarkdownOptions): View<{ alt: string; src: string }> =>
  ({ alt, src }) => {
    return (
      <Image
        alt={alt}
        size={options.images.size}
        resize={options.images.size !== undefined}
        src={{ comesFrom: src }}
        quality={options.images.quality}
      />
    )
  }
