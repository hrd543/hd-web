import { getImportPath } from './files.js'

export const buildHtml = async (pages: string[], outFile: string) => {
  // We need to use the file we just built so that names line up
  const pageBuilders = (await import(getImportPath(outFile))).default
  if (!Array.isArray(pageBuilders) || pageBuilders.length === 0) {
    throw new Error(
      "Pages wasn't an array - did you forget to add any index files?"
    )
  }

  return pageBuilders.map((builder, i) => {
    if (typeof builder !== 'function') {
      throw new Error(`Default export at ${pages[i]!} isn't a function`)
    }

    const content = builder()

    if (typeof content !== 'string') {
      throw new Error(`Default export at ${pages[i]!} doesn't return a string`)
    }

    return content
  })
}
