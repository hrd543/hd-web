import { Processor } from 'unified'
import { HdElement } from 'hd-web'

export type MarkdownOptions = {
  fileTypes: string[]
  images: {
    /** @see `@hd-web/images` `Image` component `quality` */
    quality: number
    /**
     * The width and height of the images, given the actual dimensions
     * of the image.
     *
     * Leave undefined to avoid resizing
     */
    size?: (imgDimensions: [w: number, h: number]) => [w: number, h: number]
  }
}

// Need to use global variables as the code gets bundled so may not
// necessarily reference the same local variables
declare global {
  var _hdMd: Processor<any, any, any, any, HdElement> | undefined
}
