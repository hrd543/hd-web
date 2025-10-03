import { HdConfig, Plugin } from 'hd-web'
import fg from 'fast-glob'
import nodePath from 'path'

/**
 * Returns a relative path that always starts with "./" or "../"
 */
const safeRelative = (from: string, to: string) => {
  const rel = nodePath.relative(from, to)

  if (!rel.startsWith('.') && rel !== '') {
    return './' + rel
  }

  return rel || '.'
}

export const globImportPlugin = (): Plugin<HdConfig> => {
  return {
    name: 'hd-glob-import',

    onResolve: {
      filter: /^glob:/,

      // Resolves all glob:xyz imports to point to the intended location
      async resolve({ path, importer }) {
        const pattern = path.slice(5)
        const resolved = nodePath.join(nodePath.dirname(importer), pattern)

        return {
          path: resolved,
          namespace: 'glob'
        }
      }
    },

    // Loads as if a js file which export an array of the files found in the glob
    onLoad: {
      filter: /.*/,
      namespace: 'glob',
      async load({ path: rawPath }) {
        const path = rawPath.replaceAll('\\', '/')
        const files = await fg.glob(path)

        const imports = files
          .map((file) =>
            safeRelative(process.cwd(), file).replaceAll('\\', '/')
          )
          .map((file, i) => `import * as _${i} from "${file}"`)
          .join(';')

        // Check if the imports should instead just import an exported object
        const contents = `
            ${imports};

            const files = [${files.map((f, i) => `_${i}`).join(',')}]
            export default files
          `

        return { contents }
      }
    }
  }
}
