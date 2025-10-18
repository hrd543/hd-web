import sharp from 'sharp'
import fs from 'fs/promises'
import { ImageModifications } from './imageModifications.js'

/**
 * Write `buffer` to `out` applying the `modifications`
 */
export const processImage = async (
  buffer: Buffer,
  out: string,
  modifications?: ImageModifications
) => {
  if (!modifications) {
    return await fs.writeFile(out, buffer)
  }

  const { size, quality, keepOrientation } = modifications
  let copied = await sharp(buffer)

  if (size && size[0] && size[1]) {
    let w = size[0]
    let h = size[1]

    if (keepOrientation) {
      const { width, height } = await copied.metadata()
      if (height > width) {
        w = size[1]
        h = size[0]
      }
    }

    copied = copied.resize({
      width: w,
      height: h,
      fit: 'cover',
      position: sharp.strategy.attention
    })
  }

  if (quality !== undefined) {
    copied = copied.webp({
      quality,
      lossless: false
    })
  }

  await copied.toFile(out)
}
