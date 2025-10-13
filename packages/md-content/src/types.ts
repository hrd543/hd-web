import { Processor } from 'unified'
import { HdElement } from 'hd-web'

type ImageSize = [w: number, h: number]

export type MarkdownOptions = {
  fileTypes: string[]
  images: {
    /** @see `@hd-web/images` `Image` component `quality` */
    quality: number
    /**
     * The width and height of images to be resized. Leave undefined
     * to prevent images being resized.
     *
     * Use a function to get specific sizes based on the filepath
     */
    size: ImageSize | undefined | ((path: string) => ImageSize | undefined)
  }
}

// Need to use global variables as the code gets bundled so may not
// necessarily reference the same local variables
declare global {
  var _hdMd: Processor<any, any, any, any, HdElement> | undefined
}
