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

  const { size, quality } = modifications
  let copied = await sharp(buffer)

  if (size && size[0] && size[1]) {
    copied = copied.resize({
      width: size[0],
      height: size[1],
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
