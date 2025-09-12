import { HdError } from '../../errors/index.js'
import {
  getJoinedTitle,
  getPathArray,
  getRoutes,
  getStringOrFunction
} from './pageUtils.js'
import type { BuiltPage, Page, PageStack } from './types.js'
import { validatePath } from './validatePath.js'

const buildPage = <T>(
  entry: PageStack<T>,
  data: T,
  joinTitles: boolean
): BuiltPage<T> => {
  const [p, page, titleSuffix] = entry

  if (!validatePath(p)) {
    throw new HdError('site.invalidUrl', p)
  }

  const props = page.props?.(data, getPathArray(p))

  const title = getJoinedTitle(
    titleSuffix,
    getStringOrFunction(page.title, props),
    joinTitles
  )

  return [
    p,
    {
      title,
      description: getStringOrFunction(page.description, props),
      content: page.content,
      head: page.head,
      props
    },
    page.routes !== undefined
  ]
}

/**
 * Given a page as the root, build out the page and all its subpages
 */
export const buildPages = <T>(
  root: Page<T, any>,
  data: T,
  joinTitles: boolean
): Array<BuiltPage<T>> => {
  const done: Array<BuiltPage<T>> = []
  const stack: Array<PageStack<T>> = [['', root, '']]

  while (stack.length) {
    const entry = stack.pop()!
    const built = buildPage(entry, data, joinTitles)
    done.push(built)

    const [path, { routes }] = entry
    stack.push(...getRoutes(path, routes, built[1].title))
  }

  return done
}
