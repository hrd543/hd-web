import { HdConfig, Plugin } from 'hd-web'
import fs from 'fs/promises'
import matter from 'gray-matter'

export const markdownPlugin = (): Plugin<HdConfig> => {
  return {
    name: 'hd-markdown',
    onLoad: {
      filter: /\.md$/,
      async load({ path }) {
        const contents = await fs.readFile(path)
        const { data: frontmatter, content: markdown } = matter(contents)

        return {
          contents: `
            export const meta = ${JSON.stringify(frontmatter)}
            const Content = ${JSON.stringify(markdown)}

            export default Content
          `
        }
      }
    }
  }
}
