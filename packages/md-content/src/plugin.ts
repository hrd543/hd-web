import { Plugin } from 'hd-web'
import { initialise } from './markdown.js'
import { hdPluginMarkdown } from '@hd-web/markdown'
import { hdPluginFiles } from '@hd-web/files'
import { MarkdownOptions } from './types.js'
import { hdPluginGlobImport } from '@hd-web/glob-import'

export const mdContentPlugin = (options: MarkdownOptions): Array<Plugin> => {
  initialise(options)

  // The glob plugin needs to be first to take precedence over the imports
  return [
    hdPluginGlobImport(),
    hdPluginMarkdown(),
    hdPluginFiles({ fileTypes: options.fileTypes })
  ]
}
