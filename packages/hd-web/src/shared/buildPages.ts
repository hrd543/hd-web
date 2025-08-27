import type { HdNode } from '@hd-web/jsx/jsx-runtime'
import path from 'path'

import { BuiltPage, Site, SiteFunction, SubPageFunction } from './types.js'
import { validatePath } from './validatePath.js'

type PageStack = [
  head: () => HdNode,
  path: string,
  pageFn: SubPageFunction | SiteFunction,
  title: string
]

const getRoutes = (
  routes: Site['routes'],
  head: () => HdNode,
  currentPath: string,
  title: string
) => {
  if (!routes) {
    return []
  }

  return Object.entries(routes).map<PageStack>(([route, subPage]) => [
    head,
    path.posix.join(currentPath, route),
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
  root: SiteFunction,
  joinTitles: boolean
): Promise<BuiltPage[]> => {
  const { routes, ...site } = await root()
  const contents: BuiltPage[] = [['', site, true]]
  const stack: PageStack[] = getRoutes(routes, site.head, '', site.title)

  while (stack.length) {
    const [parentHead, p, pageFn, titleSuffix] = stack.pop()!

    if (!validatePath(p)) {
      throw new Error(
        `Path ${p} contains invalid characters. Try using the cleanPath function`
      )
    }

    const page = await pageFn()
    const title = getTitle(titleSuffix, page.title, joinTitles)
    const head = page.head ?? parentHead

    contents.push([
      p,
      {
        head,
        body: page.body,
        title,
        description: page.description
      },
      page.routes !== undefined
    ])

    stack.push(...getRoutes(page.routes, head, p, title))
  }

  return contents
}
