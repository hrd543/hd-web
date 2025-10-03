import { Processor } from 'unified'
import { HdElement } from 'hd-web'

export type MarkdownOptions = {
  /** @see `@hd-web/images` `Image` component `quality` */
  imageQuality: number
}

// Need to use global variables as the code gets bundled so may not
// necessarily reference the same local variables
declare global {
  var _hdMd: Processor<any, any, any, any, HdElement> | undefined
}
