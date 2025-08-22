import { Plugin } from 'vite'

/**
 * Allows importing jsx files using .js extensions
 */
export const jsxFilePlugin = (): Plugin => ({
  name: 'hd-jsx-file-plugin',
  enforce: 'pre',
  async resolveId(source, importer) {
    // Only remap imports ending in `.js`
    if (source.endsWith('.js')) {
      const jsxPath = source.slice(0, -3) + '.jsx'
      const opts = { skipSelf: true }

      return (
        (await this.resolve(source, importer, opts)) ??
        (await this.resolve(jsxPath, importer, opts))
      )
    }

    return null
  }
})
