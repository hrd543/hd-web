/**
 * Take the default export from the built js, which is expected to be
 * an array of functions, and run those functions to return a list
 * of html contents as strings.
 *
 * Throws an error if pageBuilders isn't an array of functions returning
 * strings
 */
export const validatePages = async (pageBuilders: unknown, pages: string[]) => {
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
