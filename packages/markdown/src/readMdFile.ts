import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export type MdFile<T> = {
  meta: T
  content: string
  path: string
  name: string
}

export const readMdFile = async <T>(filepath: string): Promise<MdFile<T>> => {
  const contents = await fs.readFile(filepath)
  const { data: frontmatter, content: markdown } = matter(contents)
  const filename = path.parse(filepath).name

  return {
    meta: frontmatter as T,
    content: markdown,
    path: filepath,
    name: filename
  }
}
