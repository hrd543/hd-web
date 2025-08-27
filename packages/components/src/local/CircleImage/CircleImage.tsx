import './CircleImage.css'

import { FuncComponent } from 'hd-web'

import { Image, type ImageProps } from '../../global/index.js'

export type CircleImageProps = {
  img: ImageProps
}

/**
 * An image with a circle clip path and a circle border.
 */
export const CircleImage: FuncComponent<CircleImageProps> = ({ img }) => {
  return <Image {...img} clazz="CircleImage" />
}
