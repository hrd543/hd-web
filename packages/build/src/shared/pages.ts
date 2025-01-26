import path from 'path'
import { BuiltPage, PageReturn } from './types.js'
import { updateInteractionsPage } from './interactivity.js'

// exported for testing
/**
 * Run the page function (if it's a function) and make sure it matches the
 * schema for a PageReturn object
 */
export const validatePage = async (
  page: unknown,
  path: string
): Promise<PageReturn> => {
  if (typeof page !== 'function') {
    throw new Error(`Page at ${path} is not a function`)
  }

  const result = await page()

  if (typeof result === 'string') {
    return result
  }

  if (typeof result !== 'object' || !result) {
    throw new Error(`Page at ${path} doesn't return a string or object`)
  }

  if (!('body' in result) || typeof result.body !== 'string') {
    throw new Error(`Body missing or wrong type in ${path}`)
  }

  if (!('routes' in result)) {
    return result
  }

  if (typeof result.routes !== 'object' || result.routes === null) {
    throw new Error(`Routes at page ${path} is not an object`)
  }

  return result
}

/**
 * Given a suspected page, root, and a base path, base, try and recursively
 * build all the pages, making sure they are the correct type.
 */
export const buildPages = async (
  base: string,
  root: unknown
): Promise<BuiltPage[]> => {
  const stack: Array<[string, unknown]> = [[base, root]]
  const contents: BuiltPage[] = []

  while (stack.length) {
    const [p, page] = stack.pop()!

    // before working out the page, we need to update it
    // for the interactions
    updateInteractionsPage(p)
    const result = await validatePage(page, p)

    if (typeof result === 'string') {
      contents.push([p, result])

      continue
    }

    contents.push([p, result.body ?? ''])
    if (result.content404) {
      contents.push([p, result.content404, true])
    }

    if (result.routes) {
      stack.push(
        ...Object.entries(result.routes).map<[string, unknown]>(
          ([route, subPage]) => [path.join(p, route), subPage]
        )
      )
    }
  }

  return contents
}
