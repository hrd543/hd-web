import { type ImageProps, Image } from '../../global/index.js'
import './CircleImage.css'

import { FuncComponent } from 'hd-web'

export type CircleImageProps = {
  img: ImageProps
}

/**
 * An image with a circle clip path and a circle border.
 */
export const CircleImage: FuncComponent<CircleImageProps> = ({ img }) => {
  return <Image {...img} clazz="CircleImage" />
}
