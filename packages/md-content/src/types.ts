import { Processor } from 'unified'
import { HdElement } from 'hd-web'

export type MarkdownOptions = {
  fileTypes: string[]
  /** @see `@hd-web/images` `Image` component `quality` */
  imageQuality: number
  // TODO work out how each image could be given a width and height
  // TODO do the transposing
  /**
   * The desired width and height of all images.
   * This assumes images are landscape, if they are portrait then these
   * dimensions are tranposed.
   *
   * NB all images must be the same size atm. Options coming soon
   */
  imageSize: [w: number, h: number]
}

// Need to use global variables as the code gets bundled so may not
// necessarily reference the same local variables
declare global {
  var _hdMd: Processor<any, any, any, any, HdElement> | undefined
}
