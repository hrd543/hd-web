import path from 'path'
import { BuiltPage, Site, SubPage } from './types.js'
import { renderToString } from '@hd-web/jsx'

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
  // TODO This always defaults to the root, not its parent for example.
  const entryHead = renderToString((root as Site).head).html

  while (stack.length) {
    const [p, page, titleSuffix] = stack.pop()!
    const validated = await validatePage(page, p)
    const title = getTitle(titleSuffix, validated.title, joinTitles)
    const { html, components } = renderToString(validated.body)
    const meta = buildMeta(title, validated.description)
    const head = validated.head
      ? renderToString(validated.head).html
      : entryHead

    contents.push([
      p,
      {
        head: `${meta}${head}`,
        body: html,
        components
      },
      validated.routes !== undefined
    ])

    stack.push(...getRoutes(validated.routes, p, title))
  }

  return contents
}

const buildMeta = (title: string, description?: string): string => {
  return renderToString(
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
    </>
  ).html
}
