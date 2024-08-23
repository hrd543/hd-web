import * as fs from 'fs/promises'
import { getFilePath } from '../getFilePath.js'

export const writeToHtml = async (html: string, file: string) => {
  const htmlFile = await fs.readFile(getFilePath(file, false), 'utf-8')
  const newHtmlFile = htmlFile.replace(
    /<body>[\s\S]*<\/body>/,
    `<body>${html}</body>`
  )
  await fs.writeFile(getFilePath(file, false), newHtmlFile)
}
