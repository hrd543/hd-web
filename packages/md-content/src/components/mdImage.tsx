import { View } from 'hd-web'
import { MarkdownOptions } from '../types.js'
import { Image } from '@hd-web/files'
import path from 'path'

export const mdImage =
  (options: MarkdownOptions): View<{ alt: string; src: string }> =>
  ({ alt, src }) => {
    const { ext } = path.parse(src)
    const optimise = !options.images.ignoreFileTypes?.includes(ext)

    return (
      <Image
        alt={alt}
        size={options.images.size}
        resize={optimise && options.images.size !== undefined}
        src={{ comesFrom: src }}
        quality={optimise ? options.images.quality : undefined}
      />
    )
  }
