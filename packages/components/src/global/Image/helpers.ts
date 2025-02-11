import { type ImageProps } from './types.js'

/**
 * We don't want relative paths since all images are stored
 * in the root folder.
 */
export const getImageSrc = (src: string) =>
  src.startsWith('./') ? src.slice(1) : src

/**
 * If determined by the height, we need height at 100%
 *
 * If determined by the width, we need width at 100%
 *
 * If neither, return no styles.
 */
export const getImageStyle = (dim: ImageProps['dim']) => {
  if (!dim) {
    return
  }

  if (dim === 'h') {
    return {
      width: 'auto',
      height: '100%'
    }
  }

  return {
    width: '100%',
    height: 'auto'
  }
}
