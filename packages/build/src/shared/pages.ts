import path from 'path'
import { BuiltPage, Site, SubPage } from './types.js'
import { JSX } from '@hd-web/jsx'

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
 * schema for a page
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
  // TODO: fix these
  // validateString(result, 'body', path)
  validateString(result, 'title', path)

  // The entry point requires head
  if (initial) {
    // validateString(result, 'head', path)
  }

  if (!('routes' in result)) {
    return result
  }

  validateObject(result.routes, `Routes at page ${path} is not an object`)

  return result
}

type PageStack = [path: string, page: unknown, title: string]

const getRoutes = (
  routes: Site['routes'],
  currentPath: string,
  title: string
) => {
  if (!routes) {
    return []
  }

  return Object.entries(routes).map<PageStack>(([route, subPage]) => [
    path.join(currentPath, route),
    subPage,
    title
  ])
}

/** Sometimes we need to join each page's title together */
const getTitle = (suffix: string, title: string, joinTitles: boolean) => {
  if (!joinTitles || !suffix) {
    return title
  }

  return `${title} | ${suffix}`
}

/**
 * Given a suspected page, root, try and recursively
 * build all the pages, making sure they are the correct type.
 */
export const buildPages = async (
  root: unknown,
  joinTitles: boolean
): Promise<BuiltPage[]> => {
  const stack: PageStack[] = [['', root, '']]
  const contents: BuiltPage[] = []
  let entryHead: JSX.Element

  while (stack.length) {
    const [p, page, titleSuffix] = stack.pop()!
    const isEntry = p === ''
    const { routes, ...result } = await validatePage(page, p)

    if (isEntry) {
      entryHead = result.head!
    }

    const title = getTitle(titleSuffix, result.title, joinTitles)
    contents.push([
      p,
      {
        ...result,
        head: result.head ?? entryHead!,
        title
      },
      routes !== undefined || isEntry
    ])

    stack.push(...getRoutes(routes, p, title))
  }

  return contents
}
