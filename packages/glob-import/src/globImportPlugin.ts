import { Plugin } from 'hd-web'
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

export const globImportPlugin = (): Plugin => {
  return {
    name: 'hd-glob-import',

    bundleSetup(build) {
      build.onResolve({ filter: /^glob:/ }, async ({ path, importer }) => {
        const pattern = path.slice(5)
        const resolved = nodePath.join(nodePath.dirname(importer), pattern)

        return {
          path: resolved,
          namespace: 'glob'
        }
      })

      build.onLoad(
        { filter: /.*/, namespace: 'glob' },
        async ({ path: rawPath }) => {
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
      )
    }
  }
}
