import * as fs from 'fs/promises'
import { getFilePath } from '../getFilePath.js'

/**
 * Write the html string to the file located at htmlPath, replacing its body
 * and the script with jsPath
 */
export const writeToHtml = async (
  html: string,
  htmlPath: string,
  jsPath: string
) => {
  const htmlFile = await fs.readFile(getFilePath(htmlPath, false), 'utf-8')
  const newHtmlFile = htmlFile
    .replace(/<body>[\s\S]*<\/body>/, `<body>${html}</body>`)
    .replace(/%hd-web-script%/, jsPath)
  await fs.writeFile(getFilePath(htmlPath, false), newHtmlFile)
}
