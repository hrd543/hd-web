import { ImageProps } from './types.js'

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
