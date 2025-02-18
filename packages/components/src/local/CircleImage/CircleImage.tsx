import { type ImageProps, Image } from '../../global/index.js'
import './CircleImage.css'

import type { JSX } from '@hd-web/jsx'

export type CircleImageProps = {
  img: ImageProps
}

/**
 * An image with a circle clip path and a circle border.
 */
export const CircleImage: JSX.FuncComponent<CircleImageProps> = ({ img }) => {
  return <Image {...img} clazz="CircleImage" />
}
