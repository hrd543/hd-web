import { Image } from '@hd-web/files'
import { View } from 'hd-web'
import { MarkdownOptions } from './types.js'

const mdImage =
  (options: MarkdownOptions): View<{ alt: string; src: string }> =>
  ({ alt, src }) => {
    return (
      <Image
        alt={alt}
        width={options.imageSize[0]}
        height={options.imageSize[1]}
        resize={true}
        src={{ comesFrom: src }}
        quality={options.imageQuality}
      />
    )
  }

// We replace each of these tags with the given Views
export const getMdComponents = (options: MarkdownOptions) => {
  return {
    img: mdImage(options)
  }
}
