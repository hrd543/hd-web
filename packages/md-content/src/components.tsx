import { MarkdownOptions } from './types.js'
import { mdImage } from './components/index.js'

// We replace each of these tags with the given Views
export const getMdComponents = (options: MarkdownOptions) => {
  return {
    img: mdImage(options)
  }
}
