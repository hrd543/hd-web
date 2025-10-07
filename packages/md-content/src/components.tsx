import { HdImage, Image } from '@hd-web/images'
import { View } from 'hd-web'
import { MarkdownOptions } from './types.js'

const mdImage =
  (options: MarkdownOptions): View<{ alt: string; src: string }> =>
  ({ alt, src }) => {
    return (
      <Image
        alt={alt}
        src={{ comesFrom: src } as HdImage}
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
