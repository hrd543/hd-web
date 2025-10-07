import { HdConfig, Plugin } from 'hd-web'
import { initialise } from './markdown.js'
import { markdownPlugin } from '@hd-web/markdown'
import { hdWebPluginImages } from '@hd-web/images'
import { MarkdownOptions } from './types.js'
import { hdGlobImportPlugin } from '@hd-web/glob-import'

export const mdContentPlugin = (
  options: MarkdownOptions
): Array<Plugin<HdConfig>> => {
  initialise(options)

  // The glob plugin needs to be first to take precedence over the imports
  return [hdGlobImportPlugin(), markdownPlugin(), hdWebPluginImages()]
}
