import { Plugin } from 'hd-web'
import { readMdFile } from './readMdFile.js'

export const markdownPlugin = (): Plugin => {
  return {
    name: 'hd-markdown',

    bundleSetup(build) {
      build.onLoad({ filter: /\.md$/ }, async ({ path }) => {
        const { meta, content, name, path: mdPath } = await readMdFile(path)

        return {
          contents: `
            export const meta = ${JSON.stringify(meta)}
            export const path = ${JSON.stringify(mdPath)}
            export const name = ${JSON.stringify(name)}
            export const content = ${JSON.stringify(content)}

            export default content
          `
        }
      })
    }
  }
}
