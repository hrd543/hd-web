import { type JSX } from '@hd-web/jsx'
import { type ImageProps } from './types.js'
import { getImageSrc, getImageStyle } from './helpers.js'

export const Image: JSX.FuncComponent<ImageProps> = ({
  alt,
  src,
  srcMobile,
  ratio,
  dim = 'w',
  lazy = true,
  clazz
}) => {
  const imgSrc = srcMobile ?? src
  const sourceSrc = srcMobile ? src : undefined

  // Use height 100 just to give it an actual ratio
  const height = 100
  const width = height * ratio

  return (
    <picture class={`Image ${clazz ?? ''}`}>
      {sourceSrc ? (
        <source srcset={getImageSrc(sourceSrc)} media="(min-width: 800px)" />
      ) : null}
      <img
        loading={lazy ? 'lazy' : undefined}
        style={getImageStyle(dim)}
        width={width}
        height={height}
        alt={alt}
        src={getImageSrc(imgSrc)}
      />
    </picture>
  )
}
