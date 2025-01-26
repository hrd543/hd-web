import path from 'path'
import { BuiltPage, Site, SubPage } from './types.js'
import { updateInteractionsPage } from './interactivity.js'

const validateString = (obj: any, key: string, path: string) => {
  if (!(key in obj) || typeof obj[key] !== 'string') {
    throw new Error(`${key} missing or wrong type in${path} `)
  }
}

const validateObject = (obj: any, message: string) => {
  if (typeof obj !== 'object' || !obj) {
    throw new Error(message)
  }
}

// exported for testing
/**
 * Run the page function (if it's a function) and make sure it matches the
 * schema for a PageReturn object
 */
export const validatePage = async (
  page: unknown,
  path: string
): Promise<SubPage | Site> => {
  if (typeof page !== 'function') {
    throw new Error(`Page at ${path} is not a function`)
  }

  /** Is this the entry point? */
  const initial = path === ''
  const result = await page()

  validateObject(result, `Page at ${path} doesn't return a string or object`)
  validateString(result, 'body', path)
  validateString(result, 'title', path)

  // The entry point requires head
  if (initial) {
    validateString(result, 'head', path)
  }

  if (!('routes' in result)) {
    return result
  }

  validateObject(result.routes, `Routes at page ${path} is not an object`)

  return result
}

const getRoutes = (routes: Site['routes'], currentPath: string) => {
  if (!routes) {
    return []
  }

  return Object.entries(routes).map<[string, unknown]>(([route, subPage]) => [
    path.join(currentPath, route),
    subPage
  ])
}

/**
 * Given a suspected page, root, try and recursively
 * build all the pages, making sure they are the correct type.
 */
export const buildPages = async (root: unknown): Promise<BuiltPage[]> => {
  const stack: Array<[string, unknown]> = [['', root]]
  const contents: BuiltPage[] = []
  let entryHead = ''

  while (stack.length) {
    const [p, page] = stack.pop()!
    const isEntry = p === ''

    // before working out the page, we need to update it
    // for the interactions
    updateInteractionsPage(p)

    const { routes, ...result } = await validatePage(page, p)

    if (isEntry) {
      entryHead = result.head!
    }

    contents.push([
      p,
      {
        ...result,
        head: result.head ?? entryHead
      },
      routes !== undefined || isEntry
    ])

    stack.push(...getRoutes(routes, p))
  }

  return contents
}
