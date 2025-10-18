import { AsyncView } from 'hd-web'
import fs from 'fs/promises'

import { ImageProps, ImageSize } from './types.js'
import { getImageStyle } from './getImageStyle.js'
import { registerFile } from '../register/registerFile.js'
import { ImageModifications } from '../processing/images/index.js'
import sharp from 'sharp'
import path from 'path'

// TODO make this shared, I copied it from registerFile
const getValidatedFile = (src: string) => {
  // We can't support relative paths (yet)
  if (src.startsWith('.')) {
    throw new Error(
      `Couldn't register file ${src}. Don't currently support relative imports for files`
    )
  }

  if (src.startsWith('/')) {
    return path.join(process.cwd(), src)
  }

  return src
}

const getDimensions = (
  size: ImageProps['size'],
  fileSize: { width: number; height: number }
): ImageSize | undefined => {
  if (size === undefined) {
    return
  }

  if (Array.isArray(size)) {
    return size
  }

  return size([fileSize.width, fileSize.height])
}

export const Image: AsyncView<ImageProps> = async ({
  alt,
  src,
  size: sizeRaw,
  resize,
  quality,
  dim = 'w',
  lazy = true,
  className
}) => {
  const modifications: ImageModifications = { quality }
  const fileBuffer = await fs.readFile(getValidatedFile(src.comesFrom))
  const fileMeta = await sharp(fileBuffer).metadata()
  const size = getDimensions(sizeRaw, fileMeta)

  if (resize) {
    modifications.size = size
  }

  const newSrc = await registerFile(src.comesFrom, modifications, fileBuffer)

  return (
    <picture class={`hd-image ${className ?? ''}`}>
      <img
        loading={lazy ? 'lazy' : undefined}
        style={getImageStyle(dim)}
        width={size?.[0]}
        height={size?.[1]}
        alt={alt}
        src={newSrc}
      />
    </picture>
  )
}
