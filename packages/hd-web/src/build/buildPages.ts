import { Site, SiteFunction, SubPageFunction } from '../types/index.js'
import path from 'path'
import { BuiltPage } from './types.js'
import { HdNode } from '@hd-web/jsx'

type PageStack = [
  path: string,
  pageFn: SubPageFunction | SiteFunction,
  title: string
]

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
  root: SiteFunction,
  joinTitles: boolean
): Promise<BuiltPage[]> => {
  const stack: PageStack[] = [['', root, '']]
  const contents: BuiltPage[] = []
  // TODO This always defaults to the root, not its parent for example.
  // TODO fix this
  const entryHead: () => HdNode = () => ''

  while (stack.length) {
    const [p, pageFn, titleSuffix] = stack.pop()!
    const page = await pageFn()
    const title = getTitle(titleSuffix, page.title, joinTitles)

    contents.push([
      p,
      {
        head: page.head ?? entryHead!,
        body: page.body,
        title,
        description: page.description
      },
      page.routes !== undefined
    ])

    stack.push(...getRoutes(page.routes, p, title))
  }

  return contents
}
