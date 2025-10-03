import { HdConfig, Plugin } from 'hd-web'
import fg from 'fast-glob'
import nodePath from 'path'
import { pathToFileURL } from 'url'

export const mdGlobPlugin = (): Plugin<HdConfig> => {
  return {
    name: 'hd-markdown-glob',

    onResolve: {
      filter: /^glob:/,
      async resolve({ path, importer }) {
        const pattern = path.slice(5)

        const resolved = nodePath.join(nodePath.dirname(importer), pattern)

        console.log('resolve\n', resolved)

        return {
          path: resolved,
          namespace: 'glob'
        }
      }
    },

    onLoad: {
      filter: /.*/,
      namespace: 'glob',
      async load({ path: rawPath }) {
        const path = rawPath.replaceAll('\\', '/')
        const files = await fg.glob(path)
        console.log(files)
        const imports = files
          .map(
            (file, i) =>
              `import * as _${i} from "./${nodePath.relative(process.cwd(), file).replaceAll('\\', '/')}"`
          )
          .join(';')

        // Check if the imports should instead just import an exported object
        const contents = `
            ${imports};

            const files = [${files.map((f, i) => `_${i}`).join(',')}]
            export default files
          `

        console.log(contents)

        return {
          contents,
          resolveDir: process.cwd()
        }
      }
    }
  }
}
