import { HdConfig, Plugin } from 'hd-web'
import { initialise } from './markdown.js'
import { markdownPlugin, mdGlobPlugin } from '@hd-web/markdown'
import { hdWebPluginImages } from '@hd-web/images'
import { MarkdownOptions } from './types.js'

export const mdContentPlugin = (
  options: MarkdownOptions
): Array<Plugin<HdConfig>> => {
  initialise(options)

  return [mdGlobPlugin(), markdownPlugin(), hdWebPluginImages()]
}
